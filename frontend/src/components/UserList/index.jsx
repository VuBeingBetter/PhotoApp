import React, { useEffect, useState } from "react";
import {
  Divider,
  Link,
  List,
  ListItem
} from "@mui/material";

import { Link as RouterLink } from "react-router-dom";
import axios from "axios";

import "./styles.css";
//import fetchModelData from "../../lib/fetchModelData";

/**
 * Define UserList, a React component of CS142 Project 5.
 */
function UserList() {
  const [users, setUsers] = useState([]);

  // Fetch data
  useEffect(() => {
    axios.get('/user/list')
      .then((response) => {
        // Update state with fetched data
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); // Run once on mount

  // Component rendering
  const userListItems = users.map((user) => (
    <ListItem key={user._id}>
      <Link component={RouterLink} to={`/users/${user._id}`}>{user.first_name} {user.last_name}</Link>
    </ListItem>
  ));

  return (
    <div>
      <List component="nav">
        {userListItems}
        <Divider />
      </List>
    </div>
  );
}

export default UserList;
