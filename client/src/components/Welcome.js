import { BrowserRouter, Route } from "react-router-dom";
import Header from "./Header";
import { Grid } from "@mui/material";

const Welcome = () => {
    return (
        <div className="welcome-container">
            {/* <Header loggedIn={false} /> */}
            welcome to musical health!
            <p>Are you a doctor or a musicial?</p>
        </div>
    );
};

export default Welcome;
