import { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, TextField, Box, Typography } from "@mui/material";

class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
            view: 1,
        };
        this.updateInput = this.updateInput.bind(this);
        this.handleSubmitEmail = this.handleSubmitEmail.bind(this);
        this.handleVerifyAndSave = this.handleVerifyAndSave.bind(this);
    }

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    handleSubmitEmail(e) {
        e.preventDefault();
        fetch("/reset-password/email.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.state.email }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (!data.success) {
                    this.setState({ error: "Ops, something went wrong!" });
                } else {
                    this.setState({ view: 2 });
                }
            })
            .catch((err) => {
                console.log("error posting email on reset-password", err);
                this.setState({ error: "Ops, somenting went wrong!" });
            });
    }

    handleVerifyAndSave(e) {
        e.preventDefault();
        fetch("/reset-password/verify.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                code: this.state.code,
                password: this.state.password,
            }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                if (!data.success) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ view: 3 });
                }
            })
            .catch((err) => {
                console.log(
                    "error on fetch POST to /reset-password/verify.json",
                    err
                );
                this.setState({
                    error: "Ops, something went wrong. Please try again!",
                });
            });
    }

    handleViews() {
        if (this.state.view === 1) {
            return (
                <>
                    <Grid item style={{ textAlign: "center" }}>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            First, enter your email to receive a reset code
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
                            mt: 2,
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
                                        label="Email*"
                                        key="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email: your@email.com"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleSubmitEmail}
                                    >
                                        SUBMIT
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </>
            );
        } else if (this.state.view === 2) {
            return (
                <>
                    <Grid item style={{ textAlign: "center" }}>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            Second, enter the reset code sent to your email and
                            the new password
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
                            mt: 2,
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
                                        label="Reset code*"
                                        key="code"
                                        type="text"
                                        name="code"
                                        placeholder="Reset code"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="New password*"
                                        key="password"
                                        type="password"
                                        name="password"
                                        placeholder="New password"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                        onClick={this.handleVerifyAndSave}
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </>
            );
        } else if (this.state.view === 3) {
            return (
                <div>
                    <Typography variant="h6" component="p">
                        Password updated! Please{" "}
                        <Link to="/login">log in again</Link>.
                    </Typography>
                </div>
            );
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
                            Reset Password!
                        </Typography>
                    </Grid>
                    {this.handleViews()}
                </Grid>
            </>
        );
    }
}

export default ResetPassword;
