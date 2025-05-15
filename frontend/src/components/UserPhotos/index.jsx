import React, { useState, useEffect } from "react";
import {
  Avatar,
  Card,
  CardHeader,
  Divider,
  Typography,
  Grid,
  CardMedia,
  CardContent,
  List,
  TextField,
  Button,
} from "@mui/material";

import "./styles.css";
import { useParams } from "react-router-dom";

import GetPhotoId from "./photos";

/**
 * Define UserPhotos, a React component of Project 4.
 */

function UserPhotos() {
  const user = useParams();
  const [thisUserPhoto, setThisUserPhoto] = useState([]);

  const fetchData = async () => {
    try {
      const request = await fetch(
        `http://localhost:8081/api/photo?userId=${user.userId}`,
        {headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }}
      );
      if (!request.ok) {
        throw new Error(`Error! Status ${request.status}`);
      }
      const result = await request.json();
      setThisUserPhoto(result);

    } catch (error) {
      console.error("Error occured", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container justifyContent="center" spacing={3}>
        {thisUserPhoto.map((item) => (
            <GetPhotoId item={item}/>
        ))}
      </Grid>
    </>
  );
}

export default UserPhotos;
