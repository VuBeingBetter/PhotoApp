import React, { useEffect, useState } from "react";
import { Grid, Card, CardContent, CardMedia, Divider, Link, List, ListItem, ListItemText, Typography, Box, TextField, Button, CardHeader, Avatar } from "@mui/material";

import "./styles.css";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import { red } from "@mui/material/colors";

//import fetchModelData from "../../lib/fetchModelData";

/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
function UserPhotos() {
  // Get the userId from the route (URL) parameters
  const { userId } = useParams();

  // State for both user and photos
  const [user, setUser] = useState(null);
  const [photos, setPhotos] = useState(null);

  // Next text box, keyed by photo_id
  const [newCommentText, setNewCommentText] = useState({});

  // Fetch on its own function to call on mount and after posting comment
  const fetchData = () => {
    // Fetch user details
    const fetchUser = axios.get(`/user/${userId}`);
    // Fetch user photos
    const fetchPhotos = axios.get(`/photosOfUser/${userId}`);

    // Promise.all to fetch both at the same time
    Promise.all([fetchUser, fetchPhotos])
      .then(([userData, photoData]) => {
        // Update both states
        setUser(userData.data);
        setPhotos(photoData.data);
      })
      .catch((error) => {
        console.error('Error fetching user details or photos:', error);
      });
  };

  // Fetch data when user changes
  useEffect(() => {
    fetchData();
  }, [userId]);

  // Handle cmt change
  const handleCommentChange = (photoId, text) => {
    setNewCommentText({
      ...newCommentText,
      [photoId]: text
    });
  };

  // Handle submit comment
  const handleAddComment = (photoId) => {
    const commentText = newCommentText[photoId];
    if (!commentText) return; // Do nothing if empty

    // Post comment to server
    axios.post(`/commentsOfPhoto/${photoId}`, { comment: commentText })
      .then(() => {
        // Refresh all data to show cmt
        fetchData();
        // Clear input box
        handleCommentChange(photoId, '');
      })
      .catch((error) => {
        console.error('Error posting comment:', error);
      });
  };

  // Helper to format relative time
  const formatRelativeTime = (dateTime) => {
    const date = new Date(dateTime);
    const now = new Date();
    
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return `Just now`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  };

  // Handle the loading state
  if (!user || !photos) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Photos of {user.first_name} {user.last_name}
      </Typography>

      <Grid container spacing={2}>
        {photos.map((photo) => (
          // For each photo, create a grid item with a card
          <Grid item xs={12} key={photo._id}>
            <Card>
              {/* 1. HEADER: User Info & Post Time */}
              <CardHeader
                avatar={(
                  <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                    {user.first_name[0]}
                  </Avatar>
                )}
                title={(
                  <Link component={RouterLink} to={`/users/${user._id}`}
                    style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                  >
                    {user.first_name} {user.last_name}
                  </Link>
                )}
                subheader={formatRelativeTime(photo.date_time)}
              />
              {/* 2. DESCRIPTION: Description of the photo */}
                {photo.description && (
                  <CardContent sx={{ paddingTop: 0, paddingBottom: 1 }}>
                    <Typography variant="body1">
                      {photo.description}
                    </Typography>
                  </CardContent>
                )}
              {/* 3. IMAGE: Path is 'images/' */}
              <CardMedia
                component="img"
                maxHeight="1000"
                image={`/images/${photo.file_name}`}
                alt={photo.file_name}
              />
              {/* 4. COMMENT SECTION */}
              <CardContent>
                {/* --- Nested part for comments --- */}
                {photo.comments && (
                  <List>
                    {photo.comments.map((comment) => (
                      <ListItem key={comment._id} alignItems="flex-start" sx={{ pl: 0, pr: 0 }}>
                        <ListItemText
                          primary={
                            (
                              <>
                                <Typography component="span" variant="subtitle2" fontWeight="bold" sx={{ mr: 1 }}>
                                  <Link component={RouterLink} to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    {comment.user.first_name} {comment.user.last_name}
                                  </Link>
                                </Typography>
                                <Typography component="span" variant="body2">
                                  {comment.comment}
                                </Typography>
                              </>
                            )
                          }
                          secondary={
                            (
                              <Typography variant="caption" color="textSecondary">
                                {formatRelativeTime(comment.date_time)}
                              </Typography>
                            )
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}

                {/* New comment input */}
                <Box
                  component="form"
                  sx={{ mt:1, display:'flex', alignItems:'center' }}
                  onSubmit={(e) => {
                    e.preventDefault(); // Prevent page reload
                    handleAddComment(photo._id);
                  }}
                >
                  <TextField
                    label="Add a comment"
                    variant="standard"
                    size="small"
                    fullWidth
                    value={newCommentText[photo._id] || ''}
                    onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                  />
                  <Button
                    type="submit"
                    variant="text"
                    color="primary"
                    disabled={!newCommentText[photo._id]}
                    sx={{ ml: 1 }}
                  >
                    Post
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default UserPhotos;
