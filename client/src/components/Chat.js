import { useSelector } from "react-redux";
import { useState } from "react";
import { socket } from "../socket";

const Chat = () => {
    const [newMsg, setNewMsg] = useState("");

    const latestTenMessages = useSelector((state) => {
        return state.messages;
    });

    const handleSubmit = () => {
        if (!newMsg) {
            return;
        }
        socket.emit("wroteNewMessage", newMsg);
    };

    console.log("latest ten messages on chat component: ", latestTenMessages);
    console.log("new message", newMsg);

    return (
        <div>
            <h1>Community chat</h1>
            <div style={{ display: "flex", flexDirection: "column-reverse" }}>
                {latestTenMessages &&
                    latestTenMessages.map((message) => {
                        return (
                            <p key={message.messageId}>
                                {message.first}: {message.text}
                            </p>
                        );
                    })}
            </div>
            <input
                type="text"
                name="chatInput"
                onChange={({ target }) => setNewMsg(target.value)}
            />
            <button onClick={handleSubmit}>SEND</button>
        </div>
    );
};

export default Chat;
