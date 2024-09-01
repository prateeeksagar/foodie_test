import axios from 'axios';
import Cookies from 'js-cookie';

export const postData = async (url, data = {}, method = 'POST') => {
  try {
    const config = {
      url: `${process.env.REACT_APP_URL}${url}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'token': Cookies.get('token'),
      },
    };

    if (method === 'POST') {
      config.data = data; // Include data for POST requests
    } else if (method === 'GET') {
      config.params = data; // Include params for GET requests
    }

    const response = await axios(config);

    if (response.status === 401) { // Unauthorized
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('role');
      // Redirect to login page or main page if needed
      // navigate('/');
      return { status: false, message: 'Unauthorized access' };
    }

    return response.data;
  } catch (error) {
    console.error('Error during API call:', error);
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('role');
      // Redirect to login page or main page if needed
      // navigate('/');
    }
    return { status: false, message: error.message };
  }
};
