import Axios from 'axios';

const serverApi = Axios.create({
  // baseURL: 'http://localhost:3000',
  baseURL: 'http://qualicorp-loadbalnce-a687a28140eb9e53.elb.us-east-1.amazonaws.com',
});

export default serverApi;