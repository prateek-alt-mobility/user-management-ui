import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";
import { CreateAdminUserDto, CreateCustomerUserDto } from "../types";

// User Management Queries
export const useUsers = (
  username?: string,
  email?: string,
  adminId?: number
) => {
  return useQuery({
    queryKey: ["users", username, email, adminId],
    queryFn: () =>
      api.getAllUsers(username, email, adminId).then((res) => res.data.data),
  });
};

export const useRoles = (
  roleName?: string,
  roleId?: number,
  adminId?: number
) => {
  return useQuery({
    queryKey: ["roles", roleName, roleId, adminId],
    queryFn: () =>
      api.getAllRoles(roleName, roleId, adminId).then((res) => res.data.data),
  });
};

export const useModules = (
  moduleName?: string,
  moduleId?: number,
  adminId?: number
) => {
  return useQuery({
    queryKey: ["modules", moduleName, moduleId, adminId],
    queryFn: () =>
      api
        .getAllModules(moduleName, moduleId, adminId)
        .then((res) => res.data.data),
  });
};

export const usePermissions = (
  permissionName?: string,
  permissionId?: number,
  adminId?: number
) => {
  return useQuery({
    queryKey: ["permissions", permissionName, permissionId, adminId],
    queryFn: () =>
      api
        .getAllPermissions(permissionName, permissionId, adminId)
        .then((res) => res.data.data),
  });
};

// Mutations
export const useUpdateUserRoles = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      adminId,
      roleIds,
    }: {
      adminId: number;
      roleIds: number[];
    }) => api.updateUserRoles(adminId, roleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateRoleModules = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      moduleIds,
    }: {
      roleId: number;
      moduleIds: Array<{
        moduleId: number;
        disabled?: boolean;
        visible?: boolean;
      }>;
    }) => api.updateRoleModules(roleId, moduleIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => api.updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAdminUserDto) => api.createAdminUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useCreateCustomerUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerUserDto) => api.createCustomerUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
