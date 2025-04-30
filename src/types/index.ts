export interface CreateAdminUserDto {
  username: string;
  email: string;
  password: string;
  roleIds: number[];
}

export interface CreateCustomerUserDto {
  username: string;
  email: string;
  password: string;
  org_name: string;
  roleIds: number[];
}

export interface Role {
  id: number;
  role_name: string;
}

export interface Module {
  id: number;
  module_name: string;
}

export interface Permission {
  id: number;
  permission_name: string;
}

export interface User {
  admin_id: number;
  username: string;
  email: string;
  adminRoleMaps?: Role[];
}
