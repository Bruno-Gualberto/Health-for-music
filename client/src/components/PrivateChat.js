import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { socket } from "../socket";

import {
    Card,
    Typography,
    TextField,
    Button,
    Grid,
    Stack,
    Box,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const PrivateChat = () => {
    const [loggedUserInfo, setLoggedUserInfo] = useState({});
    const [otherUserInfo, setOtherUserInfo] = useState({});
    const [newMsg, setNewMsg] = useState("");
    const inputRef = useRef();
    let { otherUserId } = useParams();
    otherUserId = parseInt(otherUserId);

    useEffect(() => {
        (async () => {
            const respLogged = await fetch("/user.json");
            const loggedUser = await respLogged.json();
            setLoggedUserInfo(loggedUser);

            const respOther = await fetch(`/other-user/${otherUserId}.json`);
            const otherUser = await respOther.json();
            setOtherUserInfo(otherUser);
        })();
    }, []);

    const allMessages = useSelector((state) => {
        return state.privateMessages.filter((message) => {
            return (
                (message.loggedUserId === loggedUserInfo.id &&
                    message.otherUserId === otherUserId) ||
                (message.loggedUserId === otherUserId &&
                    message.otherUserId === loggedUserInfo.id)
            );
        });
    });

    const lastTenMsgs = allMessages.slice(0, 30);

    let inputRefVal;

    const handleKeyDown = (e) => {
        inputRefVal = inputRef.current.children[0].children[0].value;

        if (e.key === "Enter" && inputRefVal) {
            socket.emit("newPrivMsg", {
                newPrivMsg: inputRefVal,
                otherUserId,
            });
            inputRef.current.children[0].children[0].value = "";
        }
    };

    const handleChange = (target) => {
        setNewMsg(target.value);
    };

    const handleSubmit = () => {
        if (newMsg) {
            socket.emit("newPrivMsg", {
                newPrivMsg: newMsg,
                otherUserId,
            });
            inputRef.current.children[0].children[0].value = "";
        }
    };

    return (
        <Box className="chat-container">
            <Typography
                variant="h3"
                component="h1"
                sx={{ my: 3, fontWeight: "light", color: "primary.dark" }}
            >
                Your conversation with{" "}
                <strong>
                    {otherUserInfo.first} {otherUserInfo.last}
                </strong>
            </Typography>
            <Card
                sx={{
                    p: 3,
                    mb: 6,
                }}
                elevation={3}
            >
                <Box
                    sx={{
                        overflow: "auto",
                        height: "430px",
                    }}
                    style={{
                        display: "flex",
                        flexDirection: "column-reverse",
                    }}
                >
                    {lastTenMsgs &&
                        lastTenMsgs.map((message) => (
                            <Box key={message.id} sx={{ mb: 1 }}>
                                {message.loggedUserId === loggedUserInfo.id ? (
                                    <>
                                        <Typography
                                            sx={{
                                                color: "primary.dark",
                                                textAlign: "end",
                                            }}
                                        >
                                            You
                                        </Typography>
                                        <Typography
                                            component="p"
                                            sx={{
                                                textAlign: "end",
                                                color: "#818181",
                                            }}
                                        >
                                            {message.text}
                                        </Typography>
                                    </>
                                ) : (
                                    <Stack direction="row" spacing={2}>
                                        <img
                                            className="profile-pic-chat"
                                            src={
                                                otherUserInfo.doctorPic ||
                                                "/default-picture.png"
                                            }
                                        />
                                        <Box>
                                            <Typography
                                                sx={{
                                                    color: "primary.dark",
                                                }}
                                            >
                                                {otherUserInfo.first}{" "}
                                                {otherUserInfo.last}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "#818181",
                                                }}
                                            >
                                                {message.text}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                )}
                            </Box>
                        ))}
                </Box>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={10}>
                        <TextField
                            type="text"
                            size="small"
                            variant="outlined"
                            fullWidth
                            placeholder="Type here"
                            name="privateChat"
                            ref={inputRef}
                            onKeyDown={handleKeyDown}
                            onChange={({ target }) => handleChange(target)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            disableElevation
                            sx={{ width: 1 }}
                            variant="contained"
                            color="secondary"
                            endIcon={<Send />}
                            onClick={handleSubmit}
                        >
                            SEND
                        </Button>
                    </Grid>
                </Grid>
            </Card>
        </Box>
    );
};

export default PrivateChat;
