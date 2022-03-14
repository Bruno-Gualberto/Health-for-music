import { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, TextField, Box } from "@mui/material";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
        };
        this.updateInput = this.updateInput.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    handleLogin(e) {
        e.preventDefault();
        fetch("/user/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((data) => {
                data.success
                    ? location.reload()
                    : this.setState({
                          error:
                              "Sorry, something went wrong. Please try again!",
                      });
            })
            .catch((err) => {
                console.log("error on login: ", err);
                this.setState({
                    error: "Sorry, something went wrong. Please try again!",
                });
            });
    }

    render() {
        return (
            <>
                <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="flex-start"
                >
                    <Grid item style={{ textAlign: "center" }}>
                        <h1>Welcome!</h1>
                    </Grid>
                    <Grid
                        item
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <h2 style={{ marginTop: "0" }}>Login!</h2>
                        {this.state.error && (
                            <p style={{ color: "red" }}>{this.state.error}</p>
                        )}
                    </Grid>
                    <Grid item sx={{ width: 1 / 2 }}>
                        <Box component="form">
                            <Grid
                                container
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Email*"
                                        type="email"
                                        name="email"
                                        placeholder="Email: your@email.com"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Password*"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleLogin}
                                    >
                                        Login
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Grid item>
                        <p style={{ textAlign: "center" }}>
                            Don't have an account yet? Please{" "}
                            <Link to="/">register</Link>.
                        </p>
                    </Grid>
                    <Grid item>
                        <p style={{ textAlign: "center", marginTop: "0" }}>
                            Forgot your password?{" "}
                            <Link to="/reset-password">
                                Reset your password
                            </Link>
                            .
                        </p>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default Login;
