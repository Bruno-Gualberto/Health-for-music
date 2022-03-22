import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import FriendButton from "./FriendButton";

import { Card, Grid, Fade, Typography, Paper } from "@mui/material";

const OtherProfile = () => {
    const [toFade, setToFade] = useState(true);
    const [userData, setUserData] = useState({});
    const [error, setError] = useState();

    const { otherUserId } = useParams();
    const history = useHistory();

    useEffect(() => {
        let abort = false;
        (async () => {
            if (!abort) {
                const otherUser = await fetch(
                    `/other-user/${otherUserId}.json`
                ).then((resp) => resp.json());

                if (otherUser.error) {
                    setError("😭 Sorry, this user doesn't exist! 😭");
                } else if (otherUser.id == otherUser.loggedUserId) {
                    history.push("/");
                } else {
                    setUserData({ ...otherUser });
                }
            }
        })();
        return () => (abort = true);
    }, []);

    return (
        <Card elevation={6} sx={{ p: 4, width: 2 / 3 }}>
            {error ? (
                <Typography variant="h4" sx={{ textAlign: "center" }}>
                    {error}
                </Typography>
            ) : (
                <Grid
                    container
                    spacing={2}
                    style={{ marginLeft: "-8px" }}
                    sx={{ width: 1 }}
                    justifyContent="space-around"
                >
                    <Fade mountOnEnter in={toFade} {...{ timeout: 1000 }}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography
                                variant="h5"
                                component="h1"
                                color="white"
                            >
                                {userData.first} {userData.last}
                            </Typography>
                            <img
                                src={
                                    userData.profilePic ||
                                    "/default-picture.png"
                                }
                                style={{
                                    width: "100%",
                                    objectFit: "cover",
                                    maxHeight: "350px",
                                    borderRadius: "5px",
                                    margin: "8px 0",
                                }}
                            />
                            <FriendButton otherUserId={otherUserId} />
                        </Grid>
                    </Fade>
                    <Fade mountOnEnter in={toFade} {...{ timeout: 1000 }}>
                        <Grid item xs={12} sm={12} md={6}>
                            <Typography
                                variant="h5"
                                component="h1"
                                sx={{ mb: 1 }}
                                color="white"
                            >
                                {userData.first}'s bio
                            </Typography>
                            <Paper
                                sx={{
                                    bgcolor: "#e9e9e9",
                                    maxHeight: 353,
                                    overflow: "auto",
                                }}
                                elevation={3}
                            >
                                <Typography
                                    variant="body1"
                                    component="p"
                                    sx={{ p: 1, overflow: "auto" }}
                                >
                                    {userData.bio ||
                                        `${userData.first} doesn't have a bio yet!`}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Fade>
                </Grid>
            )}
        </Card>
    );
};

export default OtherProfile;
