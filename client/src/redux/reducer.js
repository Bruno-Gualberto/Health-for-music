import { combineReducers } from "redux";
import userDataReducer from "./userData/slice";
import privateMessagesReducer from "./privateMessages/slice";

const rootReducer = combineReducers({
    userData: userDataReducer,
    privateMessages: privateMessagesReducer,
});

export default rootReducer;
