export default function messagesReducer(messages = [], action) {
    if (action.type === "chat-message/latest") {
        // const latestMessages = [...messages, ...action.payload.msgs];
        // return latestMessages;
        messages = action.payload.msgs;
    } else if (action.type === "chat-message/received") {
        console.log("action.payload.msg on slice", action.payload.msg);
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
