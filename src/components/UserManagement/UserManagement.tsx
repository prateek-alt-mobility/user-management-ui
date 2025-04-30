import  { useState, useEffect } from 'react';
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
} from '@mui/material';
import { api } from '../../services/api';

interface Module {
  id: number;
  module_name: string;
  created_date: string;
  modified_date: string;
  module_code: string;
}

interface Permission {
  id: number;
  module_id: number;
  permission_name: string;
  code_name: string;
  created_at: string;
  updated_at: string;
}

interface RoleModuleMap {
  id: number;
  role_id: number;
  module_id: number;
  created_date: string;
  modified_date: string;
  disabled: boolean;
  visible: boolean;
  module: Module;
}

interface RolePermissionMap {
  id: number;
  role_id: number;
  permission_id: number;
  created_at: string;
  updated_at: string;
  permission: Permission;
}

interface Role {
  id: number;
  role_name: string;
  created_date: string;
  modified_date: string;
  roleModuleMaps: RoleModuleMap[];
  RolePermissionMap: RolePermissionMap[];
}

interface Admin {
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

interface AdminRoleMap {
  id: number;
  role_id: number;
  admin_id: number;
  created_date: string;
  modified_date: string;
  admin: Admin;
  role: Role;
}

interface User extends Admin {
  adminRoleMaps: AdminRoleMap[];
}

export const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [selectedModules, setSelectedModules] = useState<Record<number, { disabled: boolean; visible: boolean }>>({});
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState({
    users: false,
    roles: false,
    modules: false,
    permissions: false,
    updateUserRoles: false,
    updateRoleModules: false,
    updateRolePermissions: false,
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchModules();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await api.getAllUsers();
      console.log('Fetched users:', response.data.data); // Debug log
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchRoles = async () => {
    setLoading(prev => ({ ...prev, roles: true }));
    try {
      const response = await api.getAllRoles();
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(prev => ({ ...prev, roles: false }));
    }
  };

  const fetchModules = async () => {
    setLoading(prev => ({ ...prev, modules: true }));
    try {
      const response = await api.getAllModules();
      setModules(response.data.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(prev => ({ ...prev, modules: false }));
    }
  };

  const fetchPermissions = async () => {
    setLoading(prev => ({ ...prev, permissions: true }));
    try {
      const response = await api.getAllPermissions();
      setPermissions(response.data.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(prev => ({ ...prev, permissions: false }));
    }
  };

  const handleUserChange = (userId: number) => {
    console.log('Selected user ID:', userId); // Debug log
    const selectedUserData = users.find(user => user.admin_id === userId);
    console.log('Selected user data:', selectedUserData); // Debug log
    setSelectedUser(userId);
    // If the user has a role, set it as selected
    if (selectedUserData?.adminRoleMaps?.[0]) {
      setSelectedRole(selectedUserData.adminRoleMaps[0].role.id);
    } else {
      setSelectedRole(null);
    }
    setSelectedModules({});
    setSelectedPermissions([]);
  };

  const handleRoleChange = (roleId: number) => {
    setSelectedRole(roleId);
    const selectedRoleData = roles.find(role => role.id === roleId);
    
    // Set modules for the selected role
    if (selectedRoleData?.roleModuleMaps) {
      const moduleSettings = selectedRoleData.roleModuleMaps.reduce((acc, map) => {
        acc[map.module.id] = {
          disabled: map.disabled,
          visible: map.visible
        };
        return acc;
      }, {} as Record<number, { disabled: boolean; visible: boolean }>);
      setSelectedModules(moduleSettings);
    } else {
      setSelectedModules({});
    }

    // Set permissions for the selected role
    if (selectedRoleData?.RolePermissionMap) {
      const permissionIds = selectedRoleData.RolePermissionMap.map(map => map.permission.id);
      setSelectedPermissions(permissionIds);
    } else {
      setSelectedPermissions([]);
    }
  };

  const handleModuleChange = (moduleId: number, field: 'disabled' | 'visible', value: boolean) => {
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
      checked ? [...prev, permissionId] : prev.filter((id) => id !== permissionId)
    );
  };

  const handleSaveUserRoles = async () => {
    if (selectedUser && selectedRole) {
      setLoading(prev => ({ ...prev, updateUserRoles: true }));
      try {
        console.log('Updating user roles:', { userId: selectedUser, roleId: selectedRole }); // Debug log
        await api.updateUserRoles(selectedUser, [selectedRole]);
        await fetchUsers(); // Refresh users list after update
        console.log('User roles updated successfully'); // Debug log
      } catch (error) {
        console.error('Error updating user roles:', error);
      } finally {
        setLoading(prev => ({ ...prev, updateUserRoles: false }));
      }
    }
  };

  const handleSaveRoleModules = async () => {
    if (selectedRole) {
      setLoading(prev => ({ ...prev, updateRoleModules: true }));
      try {
        await api.updateRoleModules(
          selectedRole,
          Object.entries(selectedModules).map(([moduleId, settings]) => ({
            moduleId: parseInt(moduleId),
            ...settings,
          }))
        );
        fetchRoles();
      } catch (error) {
        console.error('Error updating role modules:', error);
      } finally {
        setLoading(prev => ({ ...prev, updateRoleModules: false }));
      }
    }
  };

  const handleSaveRolePermissions = async () => {
    if (selectedRole) {
      setLoading(prev => ({ ...prev, updateRolePermissions: true }));
      try {
        await api.updateRolePermissions(selectedRole, selectedPermissions);
        fetchRoles();
      } catch (error) {
        console.error('Error updating role permissions:', error);
      } finally {
        setLoading(prev => ({ ...prev, updateRolePermissions: false }));
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Select User</InputLabel>
          <Select
            value={selectedUser || ''}
            onChange={(e) => handleUserChange(e.target.value as number)}
            label="Select User"
            disabled={loading.users}
          >
            {users.map((user) => (
              <MenuItem key={user.admin_id} value={user.admin_id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRole || ''}
            onChange={(e) => handleRoleChange(e.target.value as number)}
            label="Select Role"
            disabled={loading.roles}
          >
            {roles.map((role) => (
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
          disabled={loading.updateUserRoles}
        >
          Assign Role to User
        </Button>
      )}

      {selectedRole && (
        <>
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Module Access
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Module</TableCell>
                    <TableCell>Disabled</TableCell>
                    <TableCell>Visible</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>{module.module_name}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedModules[module.id]?.disabled || false}
                          onChange={(e) => handleModuleChange(module.id, 'disabled', e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={selectedModules[module.id]?.visible || false}
                          onChange={(e) => handleModuleChange(module.id, 'visible', e.target.checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button
              variant="contained"
              onClick={handleSaveRoleModules}
              sx={{ mt: 2 }}
              disabled={loading.updateRoleModules}
            >
              Save Module Settings
            </Button>
          </Paper>

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Permissions
            </Typography>
            <FormGroup>
              {permissions.map((permission) => (
                <FormControlLabel
                  key={permission.id}
                  control={
                    <Checkbox
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
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
              disabled={loading.updateRolePermissions}
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
              {users.map((user) => (
                <TableRow key={user.admin_id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.adminRoleMaps && user.adminRoleMaps.length > 0 
                      ? user.adminRoleMaps.map(roleMap => roleMap.role.role_name).join(', ') 
                      : 'No role assigned'}
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