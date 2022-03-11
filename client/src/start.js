import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";

fetch("/user/id.json").then(resp => resp.json()).then(data => {
    !data.userId
        ? ReactDOM.render(<Welcome />, document.querySelector("main"))
        : ReactDOM.render(<App />, document.querySelector("main"));
})