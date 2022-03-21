export default function friendsReducer(friends = [], action) {
    if (action.type === "friends-and-wannabees/received") {
        const newFriendRequests = [...friends, ...action.payload];
        return newFriendRequests;
    } else if (action.type === "friends-and-wannabees/accept") {
        const updatedFriendsList = friends.map((friend) => {
            console.log("each friend", friend);
            friend.id == action.payload.id ? (friend.accepted = true) : null;
        });
        return updatedFriendsList;
    } else if (action.type === "friends-and-wannabees/unfriend") {
    }
    return friends;
}

// ACTION CREATORS
export function makeFriend(id) {
    return {
        type: "friends-and-wannabees/accept",
        payload: { id },
    };
}

export function addFriendRequests(allFriendRequests) {
    return {
        type: "friends-and-wannabees/received",
        payload: allFriendRequests,
    };
}

export function deleteRequest(id) {
    return {
        type: "friends-and-wannabees/unfriend",
        payload: { id },
    };
}
