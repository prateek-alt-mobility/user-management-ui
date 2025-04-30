import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { UserManagement } from './components/UserManagement/UserManagement';
import { UserCreation } from './components/UserCreation/UserCreation';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              FleetOS Admin
            </Typography>
            <Button color="inherit" component={Link} to="/">
              User Management
            </Button>
            <Button color="inherit" component={Link} to="/create-user">
              Create User
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<UserManagement />} />
            <Route path="/create-user" element={<UserCreation />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
