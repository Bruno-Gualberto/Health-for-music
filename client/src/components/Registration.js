import { Component } from "react";
import { Link } from "react-router-dom";
import { Grid, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
    };

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    };

    handleRegistration(e) {
        e.preventDefault();
        fetch("/user/register.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(this.state)
        }).then(resp => resp.json()).then(data => {
            data.success ? location.reload() : this.setState({ error: "Ops! Something went wrong. Please try again!" });
        }).catch(err => {
            console.log("error receiving response on POST /user/register.json", err)
            this.setState({ error: "Ops! Something went wrong. Please try again!" });
        })
    };

    render() {
        return (
            <>
                <h2 style={{ textAlign: "center" }}>Registration</h2>
                {this.state.error && (
                    <p className="error-message">{this.state.error}</p>
                )}
                <form>
                    <Grid
                        container
                        direction="column"
                        alignItems="center"
                        spacing={1}
                    >
                        <Grid item container xs={12}>
                            <TextField
                                className="input-TextField"
                                variant="outlined"
                                label="First name*"
                                type="text"
                                name="first"
                                placeholder="First name"
                                onChange={this.updateInput}
                            />
                        </Grid>
                        <Grid item container xs={12}>
                            <TextField
                                className="input-TextField"
                                variant="outlined"
                                label="Last name*"
                                type="text"
                                name="last"
                                placeholder="Last name"
                                onChange={this.updateInput}
                            />
                        </Grid>
                        <Grid item container xs={12}>
                            <TextField
                                className="input-TextField"
                                variant="outlined"
                                label="Email*"
                                type="email"
                                name="email"
                                placeholder="Email: your@email.com"
                                onChange={this.updateInput}
                            />
                        </Grid>
                        <Grid item container xs={12}>
                            <TextField
                                className="input-TextField"
                                variant="outlined"
                                label="Password*"
                                type="password"
                                name="password"
                                placeholder="Password"
                                onChange={this.updateInput}
                            />
                        </Grid>
                        <Grid item container xs={12} justifyContent="center">
                            <Button
                                style={{ width: "75%" }}
                                variant="contained"
                                color="primary"
                                onClick={this.handleRegistration}
                            >
                                Submit
                            </Button>
                        </Grid>
                        <Grid item container xs={12}>
                            <p
                                style={{
                                    textAlign: "center",
                                    margin: 0,
                                }}
                            >
                                Already have an account? Please{" "}
                                <Link to="/login">log in</Link>.
                            </p>
                        </Grid>
                    </Grid>
                </form>
            </>
        );
    }
}

export default Registration;