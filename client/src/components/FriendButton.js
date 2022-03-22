import { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";

const FriendButton = ({ otherUserId }) => {
    const [buttonText, setButtonText] = useState("");
    const [ignoreBtn, setIgnoreBtn] = useState("");
    const [action, setAction] = useState("");
    const [err, setErr] = useState("");

    const FRIENDSHIP_STATUS = {
        "NO-FRIENDSHIP": {
            btnText: "Send Friend Request",
            action: "SEND-REQUEST",
        },
        "PENDING-RECEIVER": {
            btnText: "Accept Friend",
            action: "ACCEPT-REQUEST",
        },
        "PENDING-RECEIVER-IGNORE": {
            btnText: "Ignore Friend",
            action: "DELETE-REQUEST",
        },
        "PENDING-SENDER": {
            btnText: "Cancel Friend Request",
            action: "DELETE-REQUEST",
        },
        FRIENDSHIP: {
            btnText: "Unfriend",
            action: "DELETE-REQUEST",
        },
    };

    useEffect(() => {
        (async () => {
            const friendshipInfo = await fetch(
                `/friendship/${otherUserId}`
            ).then((resp) => resp.json());

            if (!friendshipInfo.hasFriendship) {
                setAction(FRIENDSHIP_STATUS["NO-FRIENDSHIP"].action);
                setButtonText(FRIENDSHIP_STATUS["NO-FRIENDSHIP"].btnText);
            } else {
                if (friendshipInfo.accepted) {
                    setAction(FRIENDSHIP_STATUS.FRIENDSHIP.action);
                    setButtonText(FRIENDSHIP_STATUS.FRIENDSHIP.btnText);
                } else {
                    if (
                        friendshipInfo.loggedUserId ==
                        friendshipInfo.recipientId
                    ) {
                        setAction(FRIENDSHIP_STATUS["PENDING-RECEIVER"].action);
                        setButtonText(
                            FRIENDSHIP_STATUS["PENDING-RECEIVER"].btnText
                        );
                        setIgnoreBtn(
                            FRIENDSHIP_STATUS["PENDING-RECEIVER-IGNORE"].btnText
                        );
                    } else {
                        setAction(FRIENDSHIP_STATUS["PENDING-SENDER"].action);
                        setButtonText(
                            FRIENDSHIP_STATUS["PENDING-SENDER"].btnText
                        );
                    }
                }
            }
        })();
    }, [buttonText]);

    const handleClick = async ({ target }) => {
        fetch("/friendship-status.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                otherUserId,
                action:
                    target.id === "ignoreBtn"
                        ? FRIENDSHIP_STATUS["PENDING-RECEIVER-IGNORE"].action &&
                          setColor("error")
                        : action,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                data.error
                    ? setErr(
                          "Ops, something went wrong with your friend request!"
                      )
                    : null;
            })
            .then(() => {
                setIgnoreBtn("");
                setButtonText("");
            })
            .catch((err) => {
                console.log(
                    "error in response of post request to friendships requests: ",
                    err
                );
                setErr("Ops, something went wrong with your friend request!");
            });
    };

    let color = "";
    let variant = "";
    let add = true;
    if (buttonText === "Cancel Friend Request" || buttonText === "Unfriend") {
        variant = "outlined";
        color = "error";
        add = false;
    } else {
        variant = "contained";
        color = "secondary";
        add = true;
    }

    return (
        <>
            {err && (
                <Typography color="error" variant="body1">
                    {err}
                </Typography>
            )}
            <Button color={color} variant={variant} onClick={handleClick}>
                {add ? (
                    <PersonAdd sx={{ mr: 1 }} />
                ) : (
                    <PersonRemove sx={{ mr: 1 }} />
                )}
                {buttonText}
            </Button>
            {ignoreBtn && (
                <Button
                    sx={{ ml: 1 }}
                    id="ignoreBtn"
                    color="error"
                    variant="outlined"
                    onClick={handleClick}
                >
                    <PersonRemove sx={{ mr: 1 }} />
                    {ignoreBtn}
                </Button>
            )}
        </>
    );
};

export default FriendButton;
