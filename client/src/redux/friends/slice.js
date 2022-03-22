export default function friendsReducer(friends = [], action) {
    if (action.type === "friends-and-wannabees/received") {
        const newFriendRequests = [...friends, ...action.payload];
        return newFriendRequests;
    } else if (action.type === "friends-and-wannabees/accept") {
        const updatedFriendsList = friends.map((friend) => {
            if (friend.id === action.payload.id) {
                return {
                    ...friend,
                    accepted: true,
                };
            }
            return friend;
        });
        return updatedFriendsList;
    } else if (action.type === "friends-and-wannabees/unfriend") {
        const updatedFriendsList = friends.filter(
            (friend) => friend.id !== action.payload.id
        );
        return updatedFriendsList;
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
