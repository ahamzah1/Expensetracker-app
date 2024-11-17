import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Navbar = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified route
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Title on the left */}
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Expense Tracker
        </Typography>

        {/* Navigation items */}
        <Button color="inherit" onClick={() => handleNavigation("/")}>
          Dashboard
        </Button>

        {/* User Icon */}
        <IconButton color="inherit" onClick={() => handleNavigation("/User")}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;