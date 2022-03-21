import { combineReducers } from "redux";
import friendsReducer from "./friends/slice";

const rootReducer = combineReducers({
    friendsWannabees: friendsReducer,
});

export default rootReducer;
