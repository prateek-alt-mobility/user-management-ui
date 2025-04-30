import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import { api } from '../../services/api';
import { Role } from '../../types';

interface CreateAdminUserDto {
  email: string;
  password: string;
  username: string;
  contact_person: string;
  designation: string;
  org_name: string;
  phone_no: string;
  roleIds: number[];
}

export const UserCreation = () => {
  const [formData, setFormData] = useState<CreateAdminUserDto>({
    email: '',
    password: '',
    username: '',
    contact_person: '',
    designation: '',
    org_name: '',
    phone_no: '',
    roleIds: [],
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState({
    roles: false,
    createAdmin: false,
  });

  useEffect(() => {
    fetchRoles();
  }, []);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelection = (roleId: number, selected: boolean) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: selected
        ? [...prev.roleIds, roleId]
        : prev.roleIds.filter((id) => id !== roleId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, createAdmin: true }));
    try {
      await api.createAdminUser(formData);
      // Reset form
      setFormData({
        email: '',
        password: '',
        username: '',
        contact_person: '',
        designation: '',
        org_name: '',
        phone_no: '',
        roleIds: [],
      });
    } catch (error) {
      console.error('Error creating admin user:', error);
    } finally {
      setLoading(prev => ({ ...prev, createAdmin: false }));
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Create Admin User
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="text"
          value={formData.password}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Contact Person"
          name="contact_person"
          value={formData.contact_person}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Organization Name"
          name="org_name"
          value={formData.org_name}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone_no"
          value={formData.phone_no}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Assign Roles
          </Typography>
          <FormGroup>
            {roles.map((role) => (
              <FormControlLabel
                key={role.id}
                control={
                  <Checkbox
                    checked={formData.roleIds.includes(role.id)}
                    onChange={(e) => handleRoleSelection(role.id, e.target.checked)}
                  />
                }
                label={role.role_name}
              />
            ))}
          </FormGroup>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading.createAdmin}
        >
          Create Admin User
        </Button>
      </form>
    </Paper>
  );
}; 