import {
    allPrivateMessages,
    receivedNewPrivMessage,
} from "./redux/privateMessages/slice.js";
import { io } from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("allPrivMsgs", (allPrivMsgs) =>
            store.dispatch(allPrivateMessages(allPrivMsgs))
        );

        socket.on("receivedNewPrivMsg", (newPrivMsg) =>
            store.dispatch(receivedNewPrivMessage(newPrivMsg))
        );
    }
};
