import Axios from 'axios';

const serverApi = Axios.create({baseURL: 'http://localhost:3000'})

export default serverApi;