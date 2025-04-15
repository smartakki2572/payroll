import apiService from './APIService';

const employeeAPI = {
  // Get all employees
  getEmployees: async () => {
    try {
      const response = await apiService.get('/employees');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get employee by ID
  getEmployee: async (id) => {
    try {
      const response = await apiService.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new employee
  createEmployee: async (employeeData) => {
    try {
      const response = await apiService.post('/employees', employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update employee
  updateEmployee: async (id, employeeData) => {
    try {
      const response = await apiService.put(`/employees/${id}`, employeeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id) => {
    try {
      const response = await apiService.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search employees
  searchEmployees: async (searchTerm) => {
    try {
      const response = await apiService.get(`/employees/search/${searchTerm}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default employeeAPI;