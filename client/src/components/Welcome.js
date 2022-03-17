import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./Registration";
import Logo from "./Logo";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Header from "./Header";
import { Grid } from "@mui/material";

const Welcome = () => {
    return (
        <div className="welcome-container">
            <Header loggedIn={false} />
            <Grid container justifyContent="center">
                <Logo height="150px" />

                <BrowserRouter>
                    <Route exact path="/login">
                        <Login />
                    </Route>

                    <Route exact path="/reset-password">
                        <ResetPassword />
                    </Route>

                    <Route exact path="/">
                        <Registration />
                    </Route>
                </BrowserRouter>
            </Grid>
        </div>
    );
};

export default Welcome;
