import "./App.css";

import React, { useState } from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import Login from "./components/Login";
import { LoginPop } from "./components/PopUp";

const App = () => {
  const [user, setUser] = useState({});  
  const token = localStorage.getItem("token");
  if(!token) {
    return (
      <Router>
        <div>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />

            {/* <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid> */}

            {/* <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/" element={<LoginPop  />} />
                </Routes>
              </Paper>
            </Grid> */}

          </Grid>
        </div>
      </Router>
    );
  }
  else {
    const decoded = jwtDecode(token);
    return (
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar /> 
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route path="/users/:userId" element={<UserDetail />} />
                  <Route path="/users/photos/:userId" element={<UserPhotos />} />
                  <Route path="/users" element={<UserList />} />
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    );
  }
};

export default App;
