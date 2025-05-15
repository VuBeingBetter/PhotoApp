import React, {useEffect, useState} from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";

import "./styles.css";
import { Link } from "react-router-dom";

/**
 * Define UserList, a React component of Project 4.
 */


function UserList() {
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const request = await fetch(
        `http://localhost:8081/api/user`,
        {headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }}
      );
      //console.log(request, "ALL USER");
      if (!request.ok) {
        throw new Error(`Error! Status ${request.status}`);
      }
      else {
        const result = await request.json();
        setUsers(result);
      }
    } catch (error) {
      console.error("Error occured: ", error);
    }
  }
  useEffect(() => {
    fetchData();
  }, [users]);


  return (
    <div>
      <Divider />
      <List component="nav">
        {users.map((item) => (
          <>
            <ListItem>
              <ListItemButton
                to={`/users/${item._id}`}
                component={Link}
                key={item._id}
              >
                <ListItemText
                  primary={item.first_name + " " + item.last_name}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
          </>
        ))}
      </List>
    </div>
  );
}

export default UserList;
