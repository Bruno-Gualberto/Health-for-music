import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";

fetch("/user/id.json")
    .then((resp) => resp.json())
    .then((data) => {
        !data.userId
            ? ReactDOM.render(
                  <ThemeProvider theme={theme}>
                      <Welcome />
                  </ThemeProvider>,
                  document.querySelector("main")
              )
            : ReactDOM.render(
                  <ThemeProvider theme={theme}>
                      <App />
                  </ThemeProvider>,
                  document.querySelector("main")
              );
    });
