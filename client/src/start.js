import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import Logo from "./components/Logo"

fetch("/user/id.json").then(resp => resp.json()).then(data => {
    !data.userId
        ? ReactDOM.render(<Welcome />, document.querySelector("main"))
        : ReactDOM.render(<Logo />, document.querySelector("main"));
})