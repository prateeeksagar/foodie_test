import axios from 'axios';

const apiRequest = async (url, method, data = null) => {
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_URL}${url}`,
        method,
        data,
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error during API request:', error);
      return { status: false, message: error.response?.data?.message || 'An error occurred' };
    }
};

export const signup = async (values) => {
    let response; 
  try {
    const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role
    }
    response = await axios.post(`${process.env.REACT_APP_URL}api/user/signup`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("called the backend", response.data);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    return { status: false, message: response?.data?.message }
  }
};

export const login = async (values) => {
    return await apiRequest('api/user/login', 'POST', values);
};
  


