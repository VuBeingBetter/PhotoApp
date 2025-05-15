import { Dialog, DialogContent, DialogTitle, DialogActions, Button, TextField } from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function Login({ open, onClose, loginStatus }) {
    const {register, handleSubmit, formState:{errors}, setError} = useForm(); 
    

    const onSubmit = async (data) => {
        let err = false;
        if(data.username == '') {
            setError("username", { type: "required", message: "This field is required" });
            err = true;
        }
        if(data.password == '') {
            setError("password", { type: "required", message: "This field is required"});
            err = true;
        }

        if(!err) {
            try {
                const request = await fetch(
                    `http://localhost:8081/api/admin/login`,
                    { 
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: data.username,
                            password: data.password
                        })
                    }
                );
                // onClose = offOpenLogin
                // loginStatus = setIsLoggedIn
                // 

                if (!request.ok) {
                    loginStatus(false);
                    //loginStatus = result.token;
                    throw new Error(`Login Error! Status ${request.status}`);
                }
                // Able to login
                else {
                    const result = await request.json();
                    localStorage.setItem("token", result.token);
                    loginStatus(localStorage.getItem("token") !== null);
                    //loginStatus = result.token;
                    onClose();
                }

            } catch (error) {
                console.error("Error occured: ", error);
            }
        }
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Login
            </DialogTitle>
            
            <DialogContent>
                <TextField 
                    id="username" 
                    label="Username" 
                    required
                    {...register("username")}
                    error={errors.username}
                    helperText={errors.username && errors.username.message}
                />
                <TextField 
                    id="password" 
                    label="Password" 
                    type="password" 
                    required
                    {...register("password")}
                    error={errors.password}
                    helperText={errors.password && errors.password.message}
                />
            </DialogContent>
        
            <DialogActions>
                <Button type="submit" onClick={handleSubmit(onSubmit)} >
                    Login
                </Button>
            </DialogActions>
        </Dialog>
    );
}