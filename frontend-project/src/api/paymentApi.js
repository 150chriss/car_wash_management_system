import apiClient from './apiClient';

export const getPayments = () => apiClient.get('/payments');
export const createPayment = (data) => apiClient.post('/payments', data);
export const getBill = (recordNumber) => apiClient.get(`/payments/bill/${recordNumber}`);
export const getDailyReport = (date) => apiClient.get(`/payments/report/daily${date ? `?date=${date}` : ''}`);
