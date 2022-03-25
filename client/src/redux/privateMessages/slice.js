export default function privateMessagesReducer(privateMessages = [], action) {
    if (action.type === "private-messages/all") {
        privateMessages = action.payload.msgs;
    } else if (action.type === "private-messages/received") {
        const newPrivMessages = [action.payload.msg, ...privateMessages];
        return newPrivMessages;
    }
    return privateMessages;
}

export function allPrivateMessages(msgs) {
    return {
        type: "private-messages/all",
        payload: { msgs },
    };
}

export function receivedNewPrivMessage(msg) {
    return {
        type: "private-messages/received",
        payload: { msg },
    };
}
