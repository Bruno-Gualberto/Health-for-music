import { combineReducers } from "redux";
import friendsReducer from "./friends/slice";
import messagesReducer from "./messages/slice";
import privateMessagesReducer from "./privateMessages/slice";

const rootReducer = combineReducers({
    friendsWannabees: friendsReducer,
    messages: messagesReducer,
    privateMessages: privateMessagesReducer,
});

export default rootReducer;
