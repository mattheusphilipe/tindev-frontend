import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ec2-18-220-27-44.us-east-2.compute.amazonaws.com:3333', // no android se fizer adb reverse tcp:porta-mobile tcp:porta pc
  //baseURL: 'http://localhost:3333',
});

// baseURL: 'http://localhos:3333',// assim só funciona no ios porque o simulador do ios aponta para localhost do macOs
// baseURL: 'http://10.0.2.2:3333', // no simulador do android studio
export default api;
