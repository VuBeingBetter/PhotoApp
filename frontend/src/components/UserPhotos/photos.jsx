import { useState, useEffect } from "react";
import {
    Avatar,
    Card,
    CardHeader,
    Divider,
    Typography,
    Grid,
    CardMedia,
    CardContent,
    CardActions,
    List,
    TextField,
    Button,
} from "@mui/material";
import { useParams, Link } from "react-router-dom";


export default function GetPhotoId({item}) {
    const user = useParams();
    const [commenting, setCommenting] = useState();
    const [thisUser, setThisUser] = useState({});
    const [photoData, setPhotoData] = useState(item);
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

    const fetchData = async () => {
        try {
            const request = await fetch(
                `http://localhost:8081/api/user/detail?userId=${user.userId}`,
                { headers }
            );
            if (!request.ok) {
                throw new Error(`Error! Status ${request.status}`);
            }
            const result = await request.json();
            setThisUser(result);
            
        } catch (error) {
            console.error("Error occured", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // On Change
    const handleCommenting = (event) => {
        setCommenting(event.target.value);
    }
    const fetchComment = async () => {
        try {
            const request = await fetch(
                `http://localhost:8081/api/photo/comment?photoId=${item._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        user_id: thisUser._id,
                        comment: commenting
                    })
                }
            );
            if (!request.ok) {
                throw new Error(`Error! Status ${request.status}`);
            }
            else {
                const result = await request.json();
                setPhotoData(result.data);
            }
            
        } catch (error) {
            console.error("Error occured: ", error);
        }
        
    }
    

    return (
        <Grid item xs={6} key={photoData._id}>
            <Card>
                <CardHeader
                title={
                    <Link to={`/users/${thisUser._id}`} style={{ textDecoration: "none" }}>
                    {`${thisUser.first_name} ${thisUser.last_name}`}
                    </Link>
                }

                subheader={photoData.date_time}

                avatar={
                    <Link to={`/users/${photoData.user_id}`} style={{ textDecoration: "none" }}>
                    <Avatar style={{ backgroundColor: "#FF7F50" }}>A</Avatar>
                    </Link>
                }
                ></CardHeader>

                <CardMedia
                    component="img"
                    image={`http://localhost:8081/images/${photoData.file_name}`}
                    alt="Nuclear Drama, Absolute Cinema"
                />

                <CardContent>
                    {photoData.comments.map(i => {
                        // console.log(i);
                        return (
                            <div>
                                <CardHeader
                                title={
                                    <Link to={`/users/${i.user_id._id}`} style={{ textDecoration: "none" }}>
                                    {`${i.user_id.first_name} ${i.user_id.last_name}`}
                                    </Link>
                                }

                                subheader={i.date_time}

                                avatar={
                                    <Link to={`/users/${i.user_id}`} style={{ textDecoration: "none" }}>
                                    <Avatar style={{ backgroundColor: "#FF7F50" }}>A</Avatar>
                                    </Link>
                                }
                                ></CardHeader>
                                {i.comment}
                            </div>
                        )
                    })}
                </CardContent>

                <CardActions>
                    <List>
                        {photoData.comments && (
                        <Typography variant="subtitle1">
                            Comments:
                            <Divider variant="middle" />
                        </Typography>
                        )}
                    </List>

                    <TextField onChange={handleCommenting}></TextField>
                    <Button onClick={fetchComment}>Send</Button>

                    {/* <GetCommentedUser user_id={thisUser._id}/> */}

                </CardActions>
                
            </Card>
        </Grid>
    )
}