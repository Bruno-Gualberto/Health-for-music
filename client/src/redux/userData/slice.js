export default function userDataReducer(userData = {}, action) {
    if (action.type === "user-data/addUser") {
        return { ...action.payload.userData };
    }
    return userData;
}

export function userData(userData) {
    return {
        type: "user-data/addUser",
        payload: { userData },
    };
}
