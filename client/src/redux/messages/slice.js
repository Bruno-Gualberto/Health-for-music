export default function messagesReducer(messages = [], action) {
    if (action.type === "chat-message/latest") {
        messages = action.payload.msgs;
    } else if (action.type === "chat-message/received") {
        const newMessage = [action.payload.msg, ...messages];
        return newMessage;
    }
    return messages;
}

// ACTION CREATORS
export function latestMessages(msgs) {
    return {
        type: "chat-message/latest",
        payload: { msgs },
    };
}

export function receiveNewMessage(msg) {
    return {
        type: "chat-message/received",
        payload: { msg },
    };
}
