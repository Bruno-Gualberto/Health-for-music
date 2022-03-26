import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { socket } from "../socket";

import {
    Fade,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const PrivateChat = ({ first, strFriendId, loggedUserId }) => {
    const [newMsg, setNewMsg] = useState("");
    const inputRef = useRef();
    const toFade = true;
    const friendId = parseInt(strFriendId);

    const allMessages = useSelector((state) => {
        return state.privateMessages.filter((message) => {
            return (
                (message.loggedUserId === loggedUserId &&
                    message.friendId === friendId) ||
                (message.loggedUserId === friendId &&
                    message.friendId === loggedUserId)
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
                friendId,
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
                friendId,
            });
            inputRef.current.children[0].children[0].value = "";
        }
    };

    return (
        <Fade in={toFade} {...{ timeout: 1000 }}>
            <div>
                <Typography
                    variant="h5"
                    component="h1"
                    sx={{ mb: 1 }}
                    color="white"
                >
                    Your conversation with {first}
                </Typography>
                <div style={{ marginBottom: "8px" }}>
                    <Paper
                        component="div"
                        sx={{
                            bgcolor: "#e9e9e9",
                            height: 350,
                            overflow: "auto",
                        }}
                        style={{
                            display: "flex",
                            flexDirection: "column-reverse",
                            overflow: "auto",
                        }}
                        elevation={3}
                    >
                        {lastTenMsgs &&
                            lastTenMsgs.map((message) => (
                                <Typography
                                    key={message.id}
                                    variant="body1"
                                    component="p"
                                    sx={{
                                        p: 1,
                                        textAlign: `${
                                            message.loggedUserId ===
                                                loggedUserId && "end"
                                        }`,
                                    }}
                                >
                                    {message.text}
                                </Typography>
                            ))}
                    </Paper>
                </div>
                <Grid container spacing={1} alignItems="center">
                    <Grid item xs={9}>
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
                    <Grid item xs={3}>
                        <Button
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
            </div>
        </Fade>
    );
};

export default PrivateChat;
