import axios from 'axios';
const instance = axios.create({
  baseUrl: 'http://localhost:5000'
});

instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  console.log("axios error: ", error.message);
});

export { instance }