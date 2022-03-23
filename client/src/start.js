import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

import { createStore, applyMiddleware } from "redux";
import * as immutableState from "redux-immutable-state-invariant";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import reducer from "./redux/reducer";
import { init } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(immutableState.default()))
);

fetch("/user/id.json")
    .then((resp) => resp.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(
                <ThemeProvider theme={theme}>
                    <Welcome />
                </ThemeProvider>,
                document.querySelector("main")
            );
        } else {
            init(store);
            ReactDOM.render(
                <Provider store={store}>
                    <ThemeProvider theme={theme}>
                        <App />
                    </ThemeProvider>
                </Provider>,
                document.querySelector("main")
            );
        }
    });
