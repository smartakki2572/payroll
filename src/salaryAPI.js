import apiService from './APIService';

const salaryAPI = {
  // Get all salaries
  getSalaries: async (params) => {
    try {
      const response = await apiService.get('/salaries', { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee salary history
  getEmployeeSalaries: async (employeeId) => {
    try {
      const response = await apiService.get(`/salaries/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Calculate salary
  calculateSalary: async (employeeId, data) => {
    try {
      const response = await apiService.post(`/salaries/calculate/${employeeId}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update salary (mark as paid)
  updateSalary: async (id, data) => {
    try {
      const response = await apiService.put(`/salaries/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete salary record
  deleteSalary: async (id) => {
    try {
      const response = await apiService.delete(`/salaries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default salaryAPI;