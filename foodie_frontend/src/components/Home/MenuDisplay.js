import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import { getMenuList } from '../../api/menu';
import { useNavigate, useParams } from 'react-router-dom';

const MenuDisplay = () => {

    const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPrice, setTotalPrice] = useState(0); // State to track the total price
  const userId = Cookies.get("userId");
  const { restaurantId } = useParams(); // Get the restaurantId from the URL

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getMenuList(`api/menu/list/?restaurantId=${restaurantId}&userId=${userId}`);
        if (response.success) {
          setMenu(response.result);
        } else {
          setError(response.message);
          toast.error(response.message);
        }
      } catch (error) {
        console.error('Error fetching menu:', error);
        setError('Failed to fetch menu data.');
        toast.error('Failed to fetch menu data.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId, userId]);

  // Formik setup
  const formik = useFormik({
    initialValues: {
      selectedItems: {},
    },
    validationSchema: Yup.object({
      selectedItems: Yup.object().test(
        'hasItems',
        'Please select at least one item',
        (value) => Object.keys(value).length > 0
      ),
    }),
    onSubmit: (values) => {
        const selectedItemsWithDetails = menu
          .filter((item) => values.selectedItems[item.id])
          .map((item) => ({
            id: item.id,
            name: item.item_name,
            price: item.price,
            quantity: values.selectedItems[item.id],
          }));
    
          navigate('/cart', { state: { selectedItemsWithDetails, restaurantId } });
        },
  });

  // Calculate the total price whenever selected items change
  useEffect(() => {
    const calculateTotalPrice = () => {
      let total = 0;
      Object.keys(formik.values.selectedItems).forEach((itemId) => {
        const item = menu.find((i) => i.id === parseInt(itemId, 10));
        if (item) {
          total += formik.values.selectedItems[itemId] * item.price;
        }
      });
      setTotalPrice(total);
    };

    calculateTotalPrice();
  }, [formik.values.selectedItems, menu]);

  const handleIncrement = (id) => {
    const selectedItems = formik.values.selectedItems;
    const quantity = selectedItems[id] || 0;
    formik.setFieldValue('selectedItems', {
      ...selectedItems,
      [id]: quantity + 1,
    });
  };

  const handleDecrement = (id) => {
    const selectedItems = formik.values.selectedItems;
    const quantity = selectedItems[id];
    if (quantity > 1) {
      formik.setFieldValue('selectedItems', {
        ...selectedItems,
        [id]: quantity - 1,
      });
    } else {
      const { [id]: _, ...rest } = selectedItems;
      formik.setFieldValue('selectedItems', rest);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
    <ToastContainer/>
    <Container>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <List>
          {menu.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                backgroundColor: formik.values.selectedItems[item.id] ? '#f0f0f0' : 'transparent',
              }}
            >
              <ListItemText
                primary={item.item_name}
                secondary={`${item.description} - $${item.price}`}
              />
              <div>
                {formik.values.selectedItems[item.id] ? (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => handleDecrement(item.id)}
                    >
                      -
                    </Button>
                    <Typography variant="body1" sx={{ display: 'inline', mx: 2 }}>
                      {formik.values.selectedItems[item.id]}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleIncrement(item.id)}
                    >
                      +
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleIncrement(item.id)}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            </ListItem>
          ))}
        </List>
        {formik.errors.selectedItems ? (
          <Typography color="error">{formik.errors.selectedItems}</Typography>
        ) : null}
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Total Price: ${totalPrice.toFixed(2)}
        </Typography>
        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
          Cart
        </Button>
      </form>
    </Container>
    </>
  );
};

export default MenuDisplay;
