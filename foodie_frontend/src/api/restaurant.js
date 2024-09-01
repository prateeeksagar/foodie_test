import { postData } from "./apiCall";

export const getRestaurantList = async (url) => {
    try {
      const response = await postData(url, {}, "GET");
      return response;
    } catch (error) {
      console.error('Error fetching restaurant list:', error);
      return { status: false, message: error.message };
    }
};