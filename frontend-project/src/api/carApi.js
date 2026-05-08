import apiClient from './apiClient';

export const getCars = () => apiClient.get('/cars');
export const getCarByPlate = (plate) => apiClient.get(`/cars/${plate}`);
export const createCar = (data) => apiClient.post('/cars', data);
