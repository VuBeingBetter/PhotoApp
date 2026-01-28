import React, { useState } from "react";
import { Box, Button, Container, Grid, Link, Paper, TextField, Typography } from "@mui/material";

import axios from "axios";
axios.defaults.withCredentials = true;


function LoginRegister(props) {
    // Toggle between login and register views
    const [showRegister, setShowRegister] = useState(false);

    // Form fields
    const [loginName, setLoginName] = useState("");
    const [password, setPassword] = useState("");

    // Register only fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [occupation, setOccupation] = useState("");

    // Error/Success message
    const [message, setMessage] = useState("");

    const handleLogin = (event) => { // async?
        event.preventDefault(); // Prevent default form submission

        axios.post('/admin/login', { login_name: loginName, password: password })
            .then((response) => {
                // Server sends back user object if successful
                const user = response.data;
                setMessage("");

                // This function passed down from photoShare.jsx
                // It tells the main app that we are logged in
                props.onLogin(user);
            })
            .catch((error) => {
                setMessage(error.response ? error.response.data : "Login failed");
            });
    }

    const handleRegister = (event) => {
        event.preventDefault(); // Prevent default form submission

        if (password.length === 0) {
            return setMessage("Password cannot be empty");
        }

        const newUser = {
            login_name: loginName,
            password: password,
            first_name: firstName,
            last_name: lastName,
            location: location,
            description: description,
            occupation: occupation
        };

        axios.post('/user', newUser)
            .then((response) => {
                // Registration successful
                setMessage("Registration successful! Please log in.");
                setShowRegister(false); // Switch to login view
            })
            .catch((error) => {
                setMessage(error.response ? error.response.data : "Registration failed");
            });
    }
        
    return (
        <Container maxWidth="xs">
            <Paper elevation={3} style={{ padding: 3, marginTop: 8 }}>
                <Typography component="h1" variant="h5" alighn="center">
                    {showRegister ? "Register" : "Login"}
                </Typography>
                <Box component="form" onSubmit={showRegister ? handleRegister : handleLogin} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="login_name"
                        label="Login Name"
                        autoFocus
                        value={loginName}
                        onChange={(e) => setLoginName(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {showRegister && (
                        <>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="First Name"
                                        id="first_name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Last Name"
                                        id="last_name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Location"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Description"
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                label="Occupation"
                                id="occupation"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                            />
                        </>
                    )}

                    {message && (
                        <Typography color="error" variant="body2" align="center">
                            {message}
                        </Typography>
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {showRegister ? "Register" : "Login"}
                    </Button>

                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link
                                component="button"
                                variant="body2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowRegister(!showRegister);
                                    setMessage("");
                                }}
                            >
                                {showRegister ? "Already have an account? Login" : "Don't have an account? Register"}
                            </Link>
                        </Grid>
                    </Grid>

                </Box>
            </Paper>
        </Container>
    );
}

export default LoginRegister;