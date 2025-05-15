import React from "react";
import { useState, useEffect } from "react";
import { Typography, Grid, Button } from "@mui/material";

import "./styles.css";
import { useParams, Link } from "react-router-dom";


/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const user = useParams();
  const [thisUser, setThisUser] = useState({});

  const fetchData = async () => {
    try {
      const request = await fetch(
        `http://localhost:8081/api/user/detail?userId=${user.userId}`,
        {headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }}
      );
      if (!request.ok) {
        throw new Error(`Error! Status ${request.status}`);
      }
      else {
        const result = await request.json();
        setThisUser(result);
      }
      
    } catch (error) {
      console.error("Error occured: ", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <>
      <Grid item xs={12}>
        <Typography color="textSecondary">Name:</Typography>
        <Typography variant="h6" gutterBottom>
          {`${thisUser.first_name} ${thisUser.last_name}`}
        </Typography>

        <Typography color="textSecondary">Location:</Typography>
        <Typography variant="h6" gutterBottom>
          {`${thisUser.location}`}
        </Typography>

        <Typography color="textSecondary">Occupation:</Typography>
        <Typography variant="h6" gutterBottom>
          {`${thisUser.occupation}`}
        </Typography>

        <Typography color="textSecondary">Description:</Typography>
        <Typography variant="h6" gutterBottom>
          {`${thisUser.description}`}
        </Typography>
      </Grid>

      <Grid item xs={4} />
      <Grid item xs={4} justifyContent="center" spacing={3}>
        <br />
        <Button
          component={Link}
          to={`/users/photos/${thisUser._id}`}
          color="primary"
          variant="contained"
          size="large"
        >
          See Photo
        </Button>
      </Grid>
      <Grid item xs={4} />
    </>
  );
}

export default UserDetail;
