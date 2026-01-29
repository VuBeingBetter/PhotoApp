import React, { useState, useEffect } from "react";
import { Card, CardContent, Link, Typography } from "@mui/material";

import "./styles.css";
import { Link as RouterLink, useParams } from "react-router-dom";

import axios from "axios";

//import fetchModelData from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of CS142 Project 5.
 */
function UserDetail() {
  // Get the userId from the route (URL) parameters
  // The useParams hook reads the URL pattern 'users/:userId' defined in App.jsx
  // and gives us the value that matches :userId.
  const { userId } = useParams();

  // Initialize stat for this user's details
  const [user, setUser] = useState(null);

  // Fetch data
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchUser();

    // THE IMPORTANT PART: Dependency Array
    // This tells React to re-run this effect *whenever the userId changes*.
    // This is how you can click from one user's page to another
    // (e.g., from the UserList) and have this component update.
  }, [userId]);

  // Handle the loading state
  // While user is null (before fetch finishes), we cannot render the detail
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h4">{user.first_name} {user.last_name}</Typography>

          <Typography variant="h6" color="textSecondary">{user.occupation}</Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Location:</strong> {user.location}
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>Description:</strong> {user.description}
          </Typography>
        
          <Typography variant="body1">
            {/* This link will go to the UserPhotos component */}
            <Link component={RouterLink} to={`/photos/${user._id}`}>View Photos</Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserDetail;
