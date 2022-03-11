import { BrowserRouter, Route } from "react-router-dom";
import Registration from "./Registration";
import Logo from "./Logo";
import Login from "./Login";
import ResetPassword from "./ResetPassword";
import Header from "./Header";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    title: {
        textAlign: "center"
    }
}));

const Welcome = () => {
    const classes = useStyles();

    return (
        <div className="welcome-container">
            <Header />
            <Grid container justifyContent="center">
                <Grid item xs={12} style={{textAlign: "center"}}>
                    <Logo />
                </Grid>
                
                <BrowserRouter>
                    <Grid item>
                        <Route exact path="/login">
                            <h1 className={classes.title}>Welcome!</h1>
                            <Login />
                        </Route>
                    </Grid>

                    <Grid item>
                        <Route exact path="/reset-password">
                            <ResetPassword />
                        </Route>
                    </Grid>

                    <Grid item>
                        <Route exact path="/">
                            <h1 className={classes.title}>Welcome!</h1>
                            <Registration />
                        </Route>
                    </Grid>
                </BrowserRouter>
            </Grid>
        </div>
    );
}

export default Welcome;