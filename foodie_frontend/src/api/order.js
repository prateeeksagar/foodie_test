import { postData } from "./apiCall";

export const addOrder = async (url, data) => {
    try {
      const response = await postData(url, data, "POST");
      return response;
    } catch (error) {
      console.error('Error fetching restaurant list:', error);
      return { status: false, message: error.message };
    }
  };