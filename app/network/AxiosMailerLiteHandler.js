import axios from 'axios';

export const MAILER_LITE_URL = 'https://api.mailerlite.com/api/v2';
const access_token=''

export const mailerliteEndpoint = {
  auth: {
    appUserSubscriber:"/groups/111709999/subscribers",
    appleUserSubscriber:"/groups/111709998/subscribers"
  },
};

export const method = {
  post: 'post',
  get: 'get',
  put: 'put',
  delete: 'delete',
};

const apiClient = axios.create({
  baseURL: MAILER_LITE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-MailerLite-ApiKey':'c63b77137e21471fafd8cee2fe3981b7'
}
});

const AxiosMailerLiteRequestHandler = async (requestConfig) => {  
  try {
    // apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
    const response = await apiClient.request(requestConfig);
    return response;
  } catch (error) {
    console.log(error,'ERR');
    throw error;
  }
};

export default AxiosMailerLiteRequestHandler;
