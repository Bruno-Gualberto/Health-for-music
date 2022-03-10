import { Component } from "react";
import { Link } from "react-router-dom";

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
            [target.name]: target.value
        })
    }

    handleSubmitEmail(e) {
        e.preventDefault();
        fetch("/reset-password/email.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: this.state.email })
        }).then(resp => resp.json()).then(data => {
            if (!data.success) {
                this.setState({ error: "Ops, something went wrong!" })
            } else {
                this.setState({ view: 2 })
            }
        }).catch(err => {
            console.log("error posting email on reset-password", err)
            this.setState({ error: "Ops, somenting went wrong!" })
        })
    }

    handleVerifyAndSave(e) {
        e.preventDefault();
        fetch("/reset-password/verify.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: this.state.email, code: this.state.code, password: this.state.password })
        }).then(resp => resp.json()).then(data => {
            if (!data.success) {
                this.setState({ error: data.error })
            } else {
                this.setState({ view: 3 })
            }
        }).catch(err => {
            console.log("error on fetch POST to /reset-password/verify.json", err)
            this.setState({ error: "Ops, something went wrong. Please try again!" });
        })
    }

    handleViews() {
        if (this.state.view === 1) {
            return (
                <>
                    <p>First, enter your email</p>
                    
                    {this.state.error && 
                        <p style={{ color: "red" }}>{this.state.error}</p>
                    }
                    
                    <form>
                        <input key="email" type="email" name="email" placeholder="Email: your@email.com" onChange={this.updateInput}/>
                        <button onClick={this.handleSubmitEmail}>SUBMIT</button>
                    </form>
                </>
            )
        } else if (this.state.view === 2) {
            return (
                <>
                    <p>Second, enter the reset code and the new password</p>

                    {this.state.error && (
                        <p style={{ color: "red" }}>{this.state.error}</p>
                    )}

                    <form>
                        <input
                            key="code"
                            type="text"
                            name="code"
                            placeholder="Reset code"
                            onChange={this.updateInput}
                        />
                        <input
                            key="password"
                            type="password"
                            name="password"
                            placeholder="New password"
                            onChange={this.updateInput}
                        />
                        <button onClick={this.handleVerifyAndSave}>
                            SAVE
                        </button>
                    </form>
                </>
            );
        } else if (this.state.view === 3) {
            return (      
                <>
                    <p>Password updated! Please <Link to="/login">log in again</Link>.</p>
                </>      
            )
        }
    }

    render() {
        return (
            <>
                <h1>Reset Password!</h1>
                {this.handleViews()}
            </>
        )
    }
};

export default ResetPassword;