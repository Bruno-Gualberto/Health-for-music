import { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, TextField, Box, Typography } from "@mui/material";

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
        if (!this.state.email || !this.state.password) {
            this.setState({
                error: "All fields with * are required",
            });
        } else {
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
                        ? location.assign("/")
                        : this.setState({ error: data.error });
                })
                .catch((err) => {
                    console.log("error on login: ", err);
                    this.setState({
                        error: data.error,
                    });
                });
        }
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
                        <Typography variant="h3" component="h1">
                            Welcome!
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h2"
                            style={{ marginTop: "0" }}
                        >
                            Login!
                        </Typography>
                        {this.state.error && (
                            <Typography
                                variant="body1"
                                style={{ color: "red" }}
                            >
                                {this.state.error}
                            </Typography>
                        )}
                    </Grid>
                    <Grid
                        item
                        sx={{
                            width: {
                                xs: 4 / 5,
                                sm: 1 / 2,
                            },
                            mt: 1,
                        }}
                    >
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
                                        label="Email"
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
