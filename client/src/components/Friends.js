import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeFriend,
    addFriendRequests,
    deleteRequest,
} from "../redux/friends/slice";
import { Link } from "react-router-dom";

import { Grid, Card, Typography, Button } from "@mui/material";
import { PersonAdd, PersonRemove } from "@mui/icons-material";

const Friends = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // get request to fetch friends
        (async () => {
            const allFriendsWithRequests = await fetch(
                "/friends.json"
            ).then((resp) => resp.json());
            // dispatch an action to add results to redux
            dispatch(addFriendRequests(allFriendsWithRequests));
        })();
    }, []);

    // select wannabees from state
    const wannabees = useSelector((state) => {
        return (
            state.friendsWannabees &&
            state.friendsWannabees.filter((friend) => !friend.accepted)
        );
    });
    console.log("wannabees", wannabees);

    // select friends from state
    const friends = useSelector((state) => {
        return (
            state.friendsWannabees &&
            state.friendsWannabees.filter((friend) => friend.accepted)
        );
    });
    console.log("friends", friends);

    const handleAccept = async (id) => {
        // make a post to update the db
        const response = await fetch("/friendship-status.json", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                otherUserId: id,
                action: "ACCEPT-REQUEST",
            }),
        }).then((resp) => resp.json());
        // dispatch action to update Redux
        dispatch(makeFriend(id));
    };

    const handleDelete = async (id) => {
        const response = await fetch("/friendship-status.json", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                otherUserId: id,
                action: "DELETE-REQUEST",
            }),
        }).then((resp) => resp.json());

        dispatch(deleteRequest(id));
    };

    return (
        <section style={{ width: "100%" }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Friends
            </Typography>
            <Grid container spacing={4}>
                {!friends.length ? (
                    <Typography variant="body1" sx={{ ml: "32px", mt: 2 }}>
                        You don't have any friends yet ☹️
                    </Typography>
                ) : (
                    friends.map((friend) => {
                        return (
                            <Grid item xs={12} sm={6} md={3} key={friend.id}>
                                <Card elevation={6} sx={{ p: 2 }}>
                                    <Typography variant="h5" color="white">
                                        {friend.first} {friend.last}
                                    </Typography>
                                    <Link to={`/user/${friend.id}`}>
                                        <img
                                            className="hover-profile-pic"
                                            src={
                                                friend.profilePic ||
                                                "/default-picture.png"
                                            }
                                            style={{
                                                objectFit: "cover",
                                                height: "250px",
                                                width: "100%",
                                                margin: "8px 0",
                                            }}
                                        />
                                    </Link>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() => handleDelete(friend.id)}
                                    >
                                        <PersonRemove sx={{ mr: 1 }} />
                                        Unfriend
                                    </Button>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
            <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
                Pending friend requests
            </Typography>
            <Grid container spacing={4}>
                {!wannabees.length ? (
                    <Typography variant="body1" sx={{ ml: "32px", mt: 2 }}>
                        You don't have any friend requests at the moment!
                    </Typography>
                ) : (
                    wannabees.map((wannabee) => {
                        return (
                            <Grid item xs={12} sm={6} md={3} key={wannabee.id}>
                                <Card elevation={6} sx={{ p: 2 }}>
                                    <Typography variant="h5" color="white">
                                        {wannabee.first} {wannabee.last}
                                    </Typography>
                                    <Link to={`/user/${wannabee.id}`}>
                                        <img
                                            className="hover-profile-pic"
                                            src={
                                                wannabee.profilePic ||
                                                "/default-picture.png"
                                            }
                                            style={{
                                                objectFit: "cover",
                                                height: "250px",
                                                width: "100%",
                                                margin: "8px 0",
                                            }}
                                        />
                                    </Link>
                                    <Button
                                        sx={{ mr: 1 }}
                                        color="secondary"
                                        variant="contained"
                                        onClick={() =>
                                            handleAccept(wannabee.id)
                                        }
                                    >
                                        <PersonAdd sx={{ mr: 1 }} />
                                        Accept
                                    </Button>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        onClick={() =>
                                            handleDelete(wannabee.id)
                                        }
                                    >
                                        <PersonRemove sx={{ mr: 1 }} />
                                        Refuse
                                    </Button>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </section>
    );
};

export default Friends;
