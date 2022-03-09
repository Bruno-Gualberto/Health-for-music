import { Component } from "react";

class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
        };

        this.updateInput = this.updateInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    };

    updateInput({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    };

    handleSubmit(e) {
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
                <h2>Registration</h2>
                {this.state.error && 
                    <p style={{ color: "red" }}>{this.state.error}</p>
                }
                <form>
                    <input type="text" name="first" placeholder="First name" onChange={this.updateInput}/>
                    <input type="text" name="last" placeholder="Last name" onChange={this.updateInput}/>
                    <input type="email" name="email" placeholder="Email: your@email.com" onChange={this.updateInput}/>
                    <input type="password" name="password" placeholder="Password" onChange={this.updateInput}/>
                    <button onClick={this.handleSubmit}>SUBMIT</button>
                </form>
            </>
        )
    }
}

export default Registration;