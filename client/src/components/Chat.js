import { useSelector } from "react-redux";
import { useRef } from "react";
import { socket } from "../socket";

import { TextField, Typography, Button, Grid, Divider } from "@mui/material";
import { Send } from "@mui/icons-material";

const Chat = () => {
    const inputRef = useRef();

    const latestTenMessages = useSelector((state) => {
        return state.messages;
    });

    let inputRefVal;

    const handleKeyDown = (e) => {
        inputRefVal = inputRef.current.children[0].children[0].value;

        if (e.key === "Enter" && inputRefVal) {
            socket.emit("wroteNewMessage", inputRefVal);
            inputRef.current.children[0].children[0].value = "";
        }
    };

    const handleSubmit = () => {
        if (inputRefVal) {
            socket.emit("wroteNewMessage", inputRefVal);
            inputRef.current.children[0].children[0].value = "";
        }
    };

    return (
        <div
            style={{
                width: "400px",
                border: "1px solid #181848",
                borderRadius: "5px",
                padding: "0 10px 10px",
            }}
        >
            <h1>Community chat</h1>
            <Divider />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column-reverse",
                    height: "300px",
                    overflow: "auto",
                }}
            >
                {latestTenMessages &&
                    latestTenMessages.map((message) => (
                        <Grid
                            container
                            alignItems="center"
                            key={message.messageId}
                            sx={{ mb: 1 }}
                        >
                            <img
                                src={
                                    message.profilePic || "/default-picture.png"
                                }
                                style={{
                                    height: "40px",
                                    width: "40px",
                                    objectFit: "cover",
                                    marginRight: "5px",
                                    borderRadius: "20px",
                                }}
                            />
                            <div>
                                <Typography variant="h6">
                                    {message.first}: {message.text}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ mt: "-5px", color: "#919191" }}
                                >
                                    {message.timestamp}
                                </Typography>
                            </div>
                        </Grid>
                    ))}
            </div>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={8}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type here"
                        type="text"
                        name="chatInput"
                        ref={inputRef}
                        onKeyDown={handleKeyDown}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Button
                        sx={{ width: 1 }}
                        color="secondary"
                        variant="contained"
                        endIcon={<Send />}
                        onClick={handleSubmit}
                    >
                        send
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default Chat;
