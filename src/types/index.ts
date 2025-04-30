export interface CreateAdminUserDto {
  username: string;
  email: string;
  password: string;
  roleIds: number[];
  contact_person: string;
  designation: string;
  org_name: string;
  phone_no: string;
}

export interface CreateCustomerUserDto {
  username: string;
  email: string;
  password: string;
  org_name: string;
  roleIds: number[];
}

export interface Module {
  id: number;
  module_name: string;
  created_date: string;
  modified_date: string;
  module_code: string;
}

export interface Permission {
  id: number;
  module_id: number;
  permission_name: string;
  code_name: string;
  created_at: string;
  updated_at: string;
}

export interface RoleModuleMap {
  id: number;
  role_id: number;
  module_id: number;
  created_date: string;
  modified_date: string;
  disabled: boolean;
  visible: boolean;
  module: Module;
}

export interface RolePermissionMap {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: string;
  updated_at: string;
  permission: Permission;
}

export interface Role {
  id: number;
  role_name: string;
  created_date: string;
  modified_date: string;
  roleModuleMaps: RoleModuleMap[];
  RolePermissionMap: RolePermissionMap[];
}

export interface Admin {
  admin_id: number;
  email: string;
  status: string;
  created_date: string;
  modified_date: string;
  username: string | null;
  contact_person: string | null;
  designation: string | null;
  org_name: string | null;
  phone_no: string | null;
}

export interface AdminRoleMap {
  id: number;
  role_id: number;
  admin_id: number;
  created_date: string;
  modified_date: string;
  admin: Admin;
  role: Role;
}

export interface User extends Admin {
  adminRoleMaps: AdminRoleMap[];
}
