import apiClient from './apiClient';

export const getPackages = () => apiClient.get('/packages');
export const createPackage = (data) => apiClient.post('/packages', data);
