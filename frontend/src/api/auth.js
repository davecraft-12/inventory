import axios from 'axios';

export async function login(credentials) {
  const response = await axios.post('/api/auth/login', credentials);
  return response.data;
}
