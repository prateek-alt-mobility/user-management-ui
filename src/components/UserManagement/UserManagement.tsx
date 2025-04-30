import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  useUsers,
  useRoles,
  useModules,
  usePermissions,
  useUpdateUserRoles,
  useUpdateRoleModules,
  useUpdateRolePermissions,
} from "../../hooks/useApi";
import { User, Role, Module, Permission } from "../../types";

export const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<
    Record<number, { disabled: boolean; visible: boolean }>
  >({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const { data: roles = [], isLoading: isLoadingRoles } = useRoles();
  const { data: modules = [] } = useModules();
  const { data: permissions = [] } = usePermissions();

  const updateUserRolesMutation = useUpdateUserRoles();
  const updateRoleModulesMutation = useUpdateRoleModules();
  const updateRolePermissionsMutation = useUpdateRolePermissions();

  const handleUserChange = (userId: number) => {
    const selectedUserData = users.find(
      (user: User) => user.admin_id === userId
    );
    setSelectedUser(userId);
    if (selectedUserData?.adminRoleMaps?.[0]) {
      setSelectedRole(selectedUserData.adminRoleMaps[0].id);
    } else {
      setSelectedRole(null);
    }
    setSelectedModules({});
    setSelectedPermissions([]);
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRole(roleId);
    const selectedRoleData = roles.find((role: Role) => role.id === roleId);

    if (selectedRoleData?.roleModuleMaps) {
      const moduleSettings = selectedRoleData.roleModuleMaps.reduce(
        (
          acc: Record<number, { disabled: boolean; visible: boolean }>,
          map: { module: { id: number }; disabled: boolean; visible: boolean }
        ) => {
          acc[map.module.id] = {
            disabled: map.disabled,
            visible: map.visible,
          };
          return acc;
        },
        {} as Record<number, { disabled: boolean; visible: boolean }>
      );
      setSelectedModules(moduleSettings);
    } else {
      setSelectedModules({});
    }

    if (selectedRoleData?.RolePermissionMap) {
      const permissionIds = selectedRoleData.RolePermissionMap.map(
        (map: { permission: { id: number } }) => map.permission.id
      );
      setSelectedPermissions(permissionIds);
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleModuleChange = (
    moduleId: number,
    field: "disabled" | "visible",
    value: boolean
  ) => {
    setSelectedModules((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [field]: value,
      },
    }));
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked
        ? [...prev, permissionId]
        : prev.filter((id) => id !== permissionId)
    );
  };

  const handleSaveUserRoles = async () => {
    if (selectedUser && selectedRole) {
      await updateUserRolesMutation.mutateAsync({
        adminId: selectedUser,
        roleIds: [selectedRole],
      });
    }
  };

  const handleSaveRoleModules = async () => {
    if (selectedRole) {
      await updateRoleModulesMutation.mutateAsync({
        roleId: selectedRole,
        moduleIds: Object.entries(selectedModules).map(
          ([moduleId, settings]) => ({
            moduleId: parseInt(moduleId),
            ...settings,
          })
        ),
      });
    }
  };

  const handleSaveRolePermissions = async () => {
    if (selectedRole) {
      await updateRolePermissionsMutation.mutateAsync({
        roleId: selectedRole,
        permissionIds: selectedPermissions,
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser || ""}
            onChange={(e) => handleUserChange(e.target.value as number)}
            label="Select User"
            disabled={isLoadingUsers}
          >
            {users.map((user: User) => (
              <MenuItem key={user.admin_id} value={user.admin_id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRole || ""}
            onChange={(e) => handleRoleChange(e.target.value as number)}
            label="Select Role"
            disabled={isLoadingRoles}
          >
            {roles.map((role: Role) => (
              <MenuItem key={role.id} value={role.id}>
                {role.role_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedUser && selectedRole && (
        <Button
          variant="contained"
          onClick={handleSaveUserRoles}
          sx={{ mt: 3 }}
          disabled={updateUserRolesMutation.isPending}
        >
          Assign Role to User
        </Button>
      )}

      {selectedRole && (
        <>
          <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Modules
            </Typography>
            <FormGroup>
              {modules.map((module: Module) => (
                <FormControlLabel
                  key={module.id}
                  control={
                    <Checkbox
                      checked={selectedModules[module.id]?.visible ?? false}
                      onChange={(e) =>
                        handleModuleChange(
                          module.id,
                          "visible",
                          e.target.checked
                        )
                      }
                    />
                  }
                  label={module.module_name}
                />
              ))}
            </FormGroup>
            <Button
              variant="contained"
              onClick={handleSaveRoleModules}
              sx={{ mt: 2 }}
              disabled={updateRoleModulesMutation.isPending}
            >
              Save Modules
            </Button>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <FormGroup>
              {permissions.map((permission: Permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) =>
                        handlePermissionChange(permission.id, e.target.checked)
                      }
                    />
                  }
                  label={permission.permission_name}
                />
              ))}
            </FormGroup>
            <Button
              variant="contained"
              onClick={handleSaveRolePermissions}
              sx={{ mt: 2 }}
              disabled={updateRolePermissionsMutation.isPending}
            >
              Save Permissions
            </Button>
          </Paper>
        </>
      )}

      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Users List
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.admin_id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.adminRoleMaps && user.adminRoleMaps.length > 0
                      ? user.adminRoleMaps
                          .map((roleMap) => roleMap.role.role_name)
                          .join(", ")
                      : "No role assigned"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
