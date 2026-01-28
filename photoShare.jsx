import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Grid, Typography, Paper } from "@mui/material";
import { HashRouter, Route, Switch } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";
import UploadPhoto from "./components/UploadPhoto";

function PhotoShare() {
  // Track the logged-in user in the main app's state
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function will be passed to LoginRegister
  const handleLogin = (user) => {
    setLoggedInUser(user);
  };

  // Function passed on TopBar
  const handleLogout = () => {
    setLoggedInUser(null);
    // Note: We also need to tell the server to log out,
    // which we'll add to the TopBar component later.
  };

  return (
    <HashRouter>
      <div>
        {/* Render login logic */}
        {!loggedInUser ? (
          // If not logged in, only show LoginRegister component
          <LoginRegister onLogin={handleLogin} />
        ) : (
          // If logged in, show the main app
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {/* Pass the user and logout handler to the TopBar */}
              <TopBar user={loggedInUser} onLogout={handleLogout} />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <Typography variant="body1">
                        Welcome to your photosharing app! This{" "}
                        <a href="https://mui.com/components/paper/">Paper</a>{" "}
                        component displays the main content of the application.
                        The {"sm={9}"} prop in the{" "}
                        <a href="https://mui.com/components/grid/">Grid</a> item
                        component makes it responsively display 9/12 of the
                        window. The Switch component enables us to conditionally
                        render different components to this part of the screen.
                        You don&apos;t need to display anything here on the
                        homepage, so you should delete this Route component once
                        you get started.
                      </Typography>
                    )}
                  />
                  <Route
                    path="/users/:userId"
                    render={(props) => <UserDetail {...props} />}
                  />
                  <Route
                    path="/photos/:userId"
                    render={(props) => <UserPhotos {...props} />}
                  />
                  <Route path="/users" component={UserList} />
                  <Route path="/upload" component={UploadPhoto} />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        )}

        
      </div>
    </HashRouter>
  );
}

ReactDOM.render(<PhotoShare />, document.getElementById("photoshareapp"));
