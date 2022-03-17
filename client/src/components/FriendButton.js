import { useState, useEffect } from "react";
import { Button } from "@mui/material";

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
            btnText: "Accept Friend Request",
            action: "ACCEPT-REQUEST",
        },
        "PENDING-RECEIVER-IGNORE": {
            btnText: "Ignore Friend Request",
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
                        ? FRIENDSHIP_STATUS["PENDING-RECEIVER-IGNORE"].action
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

    return (
        <>
            {err && <p>{err}</p>}
            <Button onClick={handleClick}>{buttonText}</Button>
            {ignoreBtn && (
                <Button id="ignoreBtn" onClick={handleClick}>
                    {ignoreBtn}
                </Button>
            )}
        </>
    );
};

export default FriendButton;
