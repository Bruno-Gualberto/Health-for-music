import { latestMessages, receiveNewMessage } from "./redux/messages/slice.js";
import {
    allPrivateMessages,
    receivedNewPrivMessage,
} from "./redux/privateMessages/slice.js";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("latestMessages", (msgs) =>
            store.dispatch(latestMessages(msgs))
        );

        socket.on("receiveNewMessage", (msg) =>
            store.dispatch(receiveNewMessage(msg))
        );

        socket.on("allPrivMsgs", (allPrivMsgs) =>
            store.dispatch(allPrivateMessages(allPrivMsgs))
        );

        socket.on("receivedNewPrivMsg", (newPrivMsg) =>
            store.dispatch(receivedNewPrivMessage(newPrivMsg))
        );
    }
};
