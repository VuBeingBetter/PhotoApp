import React, { useState, useEffect } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";

import "./styles.css";
import { useParams } from "react-router-dom";

import Login from "../Login";
import { LoginPop } from "../PopUp";

/**
 * Define TopBar, a React component of Project 4.{user, setUser} = useState({})
 */
function TopBar() {
  const { openLogin, onOpenLogin, offOpenLogin } = LoginPop();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") !== null);
  //let isLoggedIn = localStorage.getItem("token");

  const handleLogin = () => {
    offOpenLogin();
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(localStorage.getItem("token") !== null);
    location.reload();
  }

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>

        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Nuclear Photo App
        </Typography>

        {/* <Typography variant="h5" color="inherit">
          User: {user.first_name} {user.last_name}  
        </Typography> */}

        {!isLoggedIn ?
        (<Button variant="text" size="large" color="inherit" sx={{ flexGrow: 0 }} onClick={onOpenLogin}>
          Login
        </Button>)
        :
        (<Button variant="text" size="large" color="inherit" sx={{ flexGrow: 0 }} onClick={handleLogout}>
          Logout
        </Button>)
        }
        
        <Login open={openLogin} onClose={handleLogin} loginStatus={setIsLoggedIn}/>

      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
