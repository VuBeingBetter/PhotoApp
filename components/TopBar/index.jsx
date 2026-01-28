import React, { useEffect, useState } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import "./styles.css";
import { useLocation, useHistory, Link as RouterLink } from 'react-router-dom'; // <-- Add RouterLink
import axios from "axios";

/**
 * Define TopBar, a React component of CS142 Project 5.
 */
function TopBar(props) {
  const location = useLocation();
  const history = useHistory();
  const [context, setContext] = useState("");

  // Update the context based on the URL
  useEffect(() => {
    const path = location.pathname;

    // Expandable for Extra Credits
    if (path.startsWith("/users/")) {
      setContext("User Details");
    } else if (path.startsWith("/photos/")) {
      setContext("User Photos");
    } else {
      setContext("Home");
    }
  }, [location.pathname]);  

  const handleLogout = () => {
    axios.post('/admin/logout')
      .then(() => {
        // Call onLogout function passed from photoShare.jsx
        props.onLogout();
        history.push("/"); // Redirect to home or login page
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  }

  return (
    <AppBar className="cs142-topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" sx={{ flexGrow: 1 }}>
          {/* Use the logged-in user's name */}
          {props.user.first_name}'s Photo Share
        </Typography>
        <Typography variant="h6" color="inherit" sx={{ marginRight: 2 }}>
          {context} {/* Shows 'User Details', 'User Photos', etc. */}
        </Typography>

        <Button
          component={RouterLink}
          to="/upload"
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
        >
          Add Photo
        </Button>
        
        <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
