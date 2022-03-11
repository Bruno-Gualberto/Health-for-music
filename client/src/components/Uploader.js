import { Component } from "react";

class Uploader extends Component {
    constructor(props) {
        super(props)
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        // append file to FormData that is on state
        // send data to server
        // if success: update profilePic property from the state App via method passed down in props (updateProfilePic)
        const fd = new FormData();
        fd.append("file", this.state.profilePic);

        fetch("/profile-pic.json", {
            method: "POST",
            body: fd
        }).then(resp => resp.json()).then(data => {
            // updating profilePic in App state with only the pic URL:
            this.props.updateProfilePic(data.profilePic)

        }).catch(err => console.log("error uploading profile picture", err));
    }

    render() {
        return (
            <div>
                Uploader
                <div onClick={this.props.toggleUploader}>X</div>
                <form onSubmit={(e) => this.handleSubmit(e)}>
                    <input type="file" name="profilePic" onChange={(e) => this.handleChange(e)}/>
                    <button>UPLOAD</button>
                </form>
            </div>
        )
    }
}

export default Uploader;