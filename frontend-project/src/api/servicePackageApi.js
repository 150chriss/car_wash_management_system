import apiClient from './apiClient';

export const getServicePackages = () => apiClient.get('/servicepackages');
export const getServicePackageByRecord = (recordNumber) => apiClient.get(`/servicepackages/${recordNumber}`);
export const createServicePackage = (data) => apiClient.post('/servicepackages', data);
export const updateServicePackage = (recordNumber, data) => apiClient.put(`/servicepackages/${recordNumber}`, data);
export const deleteServicePackage = (recordNumber) => apiClient.delete(`/servicepackages/${recordNumber}`);
