import axios from 'axios';
import qs from 'qs';

const AxiosPostRequest = async (url, data, headers = {}) => {
  const requestConfig = {
    method: 'post',
    url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers,
    },
    data: qs.stringify(data),
  };

  try {
    const response = await axios(requestConfig);
    return response.data;
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    throw error; // Rethrow error for further handling if needed
  }
};

export default AxiosPostRequest;
