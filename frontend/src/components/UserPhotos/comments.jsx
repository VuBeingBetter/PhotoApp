// These codes haven't done anything yet!



import React from 'react';
import { ListItemAvatar, ListItemText } from '@mui/material';

export default async function GetCommentedUser(user_id) {
    // let user = {};
    // const request = await fetch(
    //   `https://localhost:8081/api/user/detail?userId=${user_id}`
    // );
    // user = request.json();
    
    return (
        <>
        {item.comments && item.comments.map((comment) => (
            <ListItem key={comment._id}>
                <ListItemAvatar>
                    <Link to={`/users/${user.user_id}`} style={{ textDecoration: "none" }}>
                        <Avatar style={{ backgroundColor: "#FF7F50" }}>A</Avatar>
                    </Link>
                </ListItemAvatar>
            <ListItemText>
                <Typography variant="subtitle2">
                    <Link to={`/users/${user.user_id}`} style={{ textDecoration: "none" }}>
                        {`${user.first_name} ${user.last_name}`}
                    </Link>
                </Typography>
                <Typography variant="caption" color="textSecondary" gutterBottom>
                    {comment.date_time}
                </Typography>
                <Typography variant="body1">
                    {`${comment.comment}`}
                </Typography>
            </ListItemText>
        </ListItem>
        ))}
        </>
    );
}
