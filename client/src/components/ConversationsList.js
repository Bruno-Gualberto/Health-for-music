import { Box, Stack, Divider, Typography, Button } from "@mui/material";

const ConversationsList = ({ lastMsg }) => {
    let otherUser;

    if (lastMsg.userId !== lastMsg.loggedUserId) {
        otherUser = lastMsg.loggedUserId;
    } else {
        otherUser = lastMsg.otherUserId;
    }

    return (
        <>
            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{ p: 2 }}
            >
                <img
                    className="small-round-profile-pic"
                    src={lastMsg.profilePic || "/default-picture.png"}
                />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ color: "primary.dark" }}>
                        {lastMsg.first} {lastMsg.last}
                    </Typography>
                    <Typography sx={{ color: "#818181" }}>
                        {lastMsg.loggedUserId === lastMsg.userId
                            ? "You: "
                            : null}
                        {lastMsg.text}
                    </Typography>
                </Box>
                <Stack
                    sx={{ width: 1 / 4 }}
                    direction="row"
                    alignItems="flex-end"
                    justifyContent="flex-end"
                >
                    <Button
                        href={`/private-chat/${otherUser}`}
                        disableElevation
                        variant="contained"
                        color="secondary"
                    >
                        Open chat
                    </Button>
                </Stack>
            </Stack>
            <Divider />
        </>
    );
};

export default ConversationsList;
