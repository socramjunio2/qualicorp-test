import Axios from 'axios';

const serverApi = Axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'http://44.200.76.178',
});

export default serverApi;