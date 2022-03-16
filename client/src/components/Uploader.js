import { Component } from "react";
import { Fab, Fade } from "@mui/material";
import { AddPhotoAlternate, Upload } from "@mui/icons-material";

class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transition: false,
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
            transition: true,
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
            body: fd,
        })
            .then((resp) => resp.json())
            .then((data) => {
                // updating profilePic in App state with only the pic URL:
                this.props.updateProfilePic(data.profilePic);
                this.props.toggleUploader();
            })
            .catch((err) =>
                console.log("error uploading profile picture", err)
            );
    }

    render() {
        return (
            <div>
                Uploader
                <div onClick={this.props.toggleUploader}>X</div>
                <form>
                    {!this.state.profilePic ? (
                        <Fab
                            variant="contained"
                            color="primary"
                            component="label"
                        >
                            <AddPhotoAlternate />
                            <input
                                type="file"
                                hidden
                                name="profilePic"
                                onChange={(e) => this.handleChange(e)}
                            />
                        </Fab>
                    ) : (
                        <Fade
                            in={this.state.transition}
                            style={{ transformOrigin: "left center" }}
                            {...{ timeout: 1000 }}
                        >
                            <Fab
                                // definir maxWidth e depois text overflow 'elipsis'
                                variant="extended"
                                color="primary"
                                onClick={(e) => this.handleSubmit(e)}
                            >
                                <Upload />
                                {this.state.profilePic.name}
                            </Fab>
                        </Fade>
                    )}
                </form>
            </div>
        );
    }
}

export default Uploader;
