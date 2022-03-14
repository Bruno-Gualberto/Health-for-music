import { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, TextField, Box } from "@mui/material";

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    }

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    handleRegistration(e) {
        e.preventDefault();
        fetch("/user/register.json", {
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
                          error: "Ops! Something went wrong. Please try again!",
                      });
            })
            .catch((err) => {
                console.log(
                    "error receiving response on POST /user/register.json",
                    err
                );
                this.setState({
                    error: "Ops! Something went wrong. Please try again!",
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
                    <Grid item style={{ textAlign: "center" }}>
                        <h2 style={{ marginTop: "0" }}>Registration</h2>
                        {this.state.error && (
                            <p className="error-message">{this.state.error}</p>
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
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="First name*"
                                        type="text"
                                        name="first"
                                        placeholder="First name"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        label="Last name*"
                                        type="text"
                                        name="last"
                                        placeholder="Last name"
                                        onChange={this.updateInput}
                                    />
                                </Grid>
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
                                        onClick={this.handleRegistration}
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item>
                        <p
                            style={{
                                textAlign: "center",
                                margin: "10px 0 0",
                            }}
                        >
                            Already have an account? Please{" "}
                            <Link to="/login">log in</Link>.
                        </p>
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default Registration;
