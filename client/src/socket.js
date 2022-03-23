import { latestMessages, receiveNewMessage } from "./redux/messages/slice.js";
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
    }
};
