import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    makeFriend,
    addFriendRequests,
    deleteRequest,
} from "../redux/friends/slice";

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

    return (
        <section>
            <h1>Friends</h1>
            {friends &&
                friends.map((friend) => {
                    return (
                        <div key={friend.id}>
                            friend {friend.first}
                            <button onClick={() => handleDelete(friend.id)}>
                                Unfriend
                            </button>
                        </div>
                    );
                })}
            <h1>Wannabees</h1>
            {wannabees &&
                wannabees.map((wannabee) => {
                    return (
                        <div key={wannabee.id}>
                            wannabee {wannabee.first}
                            <button onClick={() => handleAccept(wannabee.id)}>
                                Accept
                            </button>
                            <button onClick={() => handleDelete(wannabee.id)}>
                                Refuse
                            </button>
                        </div>
                    );
                })}
        </section>
    );
};

export default Friends;
