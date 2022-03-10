import { Component } from "react";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: null,
        }
        this.updateInput = this.updateInput.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value
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
        }).then(resp => resp.json()).then(data => {
            data.success ? location.reload() : this.setState({
                error: "Sorry, something went wrong. Please try again!",
            });
        }).catch(err => {
            console.log("error on login: ", err);
            this.setState({
                error: "Sorry, something went wrong. Please try again!",
            });
        });
    }

    render() {
        return (
            <>
                <h2>Login!</h2>
                {this.state.error && (
                    <p style={{ color: "red" }}>{this.state.error}</p>
                )}
                <form>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email: your@email.com"
                        onChange={this.updateInput}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.updateInput}
                    />
                    <button onClick={this.handleLogin}>SUBMIT</button>
                </form>
                <p>Don't have an account yet? Please <Link to="/">register</Link>.</p>
                <p>Forgot your password? <Link to="/reset-password">Reset your password</Link>.</p>
            </>
        );
    }
}

export default Login;