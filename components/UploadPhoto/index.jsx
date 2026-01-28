import React, { useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useHistory } from "react-router-dom";

/**
 * A component for User Photo Upload.
 */
function UploadPhoto() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const history = useHistory();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage("");
  };

  const handleUpload = (event) => {
    event.preventDefault();
    if (!selectedFile) {
      return setMessage("Please select a file to upload.");
    }

    // Use FormData to send the file
    const formData = new FormData();

    // uploadedphoto must match the name in multer config
    formData.append("uploadedphoto", selectedFile);

    // Append the description
    formData.append("description", description);

    // POST request
    axios.post("/photos/new", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    })
      .then((response) => {
        // On success, redirect to the user's photo page
        // Server sends back the new phot with user_id
        const newPhoto = response.data;
        history.push(`/photos/${newPhoto.user_id}`);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
        if (error.response) {
          setMessage(error.response.data);
        } else {
          setMessage("An error occurred during upload.");
        }
      });
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{padding: 3, marginTop: 8}}>
        <Typography component="h1" variant="h5" align="center">
          New Photo
        </Typography>
        <Box component="form" onSubmit={handleUpload} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            type="file"
            InputLabelProps={{
              shrink: true, // Keep label from overlay file name
            }}
            label="Selected Photo"
            onChange={ handleFileChange }
          />

          {message && (
            <Typography color="error" variant="body2" align="center">{message}</Typography>
          )}

          <TextField
            margin="normal"
            fullWidth
            multiline
            rows={2}
            label="Describe your photo"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Upload
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default UploadPhoto;