import axios from 'axios';

const API_BASE_URL = 'https://dev-api.alt-mobility.com/auth/adhoc';

export const api = {
  // User Management
  getAllUsers: (username?: string, email?: string, adminId?: number) =>
    axios.get(`${API_BASE_URL}/users`, { params: { username, email, adminId } }),

  updateUserRoles: (adminId: number, roleIds: number[]) =>
    axios.put(`${API_BASE_URL}/users/${adminId}/roles`, { roleIds }),

  // Role Management
  getAllRoles: (roleName?: string, roleId?: number, adminId?: number) =>
    axios.get(`${API_BASE_URL}/roles`, { params: { roleName, roleId, adminId } }),

  updateRoleModules: (
    roleId: number,
    moduleIds: Array<{
      moduleId: number;
      disabled?: boolean;
      visible?: boolean;
    }>,
  ) => axios.put(`${API_BASE_URL}/roles/${roleId}/modules`, { moduleIds }),

  updateRolePermissions: (roleId: number, permissionIds: number[]) =>
    axios.put(`${API_BASE_URL}/roles/${roleId}/permissions`, { permissionIds }),

  // Module Management
  getAllModules: (moduleName?: string, moduleId?: number, adminId?: number) =>
    axios.get(`${API_BASE_URL}/modules`, { params: { moduleName, moduleId, adminId } }),

  // Permission Management
  getAllPermissions: (permissionName?: string, permissionId?: number, adminId?: number) =>
    axios.get(`${API_BASE_URL}/permissions`, { params: { permissionName, permissionId, adminId } }),

  // User Creation
  createAdminUser: (data: CreateAdminUserDto) =>
    axios.post(`${API_BASE_URL}/create-admin`, data),

  createCustomerUser: (data: CreateCustomerUserDto) =>
    axios.post(`${API_BASE_URL}/create-customer`, data),
}; 