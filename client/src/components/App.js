import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./Logo";
import Uploader from "./Uploader";
import Profile from "./Profile";
import Header from "./Header";
import FindPeople from "./FindPeople";
import { Grid } from "@mui/material";

class App extends Component {
    constructor() {
        super();
        this.state = {
            first: "",
            last: "",
            email: "",
            profilePic: "",
            bio: "",
            userId: null,
            uploaderVisible: false,
        };
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        fetch("/user/data.json")
            .then((resp) => resp.json())
            .then((data) => {
                this.setState(data);
            })
            .catch((err) => console.log("error getting user info:", err));
    }

    toggleUploader() {
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl });
    }

    setBio(newBio) {
        this.setState({ bio: newBio });
    }

    render() {
        return (
            <div>
                <Header />
                <Grid container justifyContent="center" rowSpacing={2}>
                    <Grid item xs={12} container justifyContent="center">
                        <Logo height="150px" />
                    </Grid>

                    <BrowserRouter>
                        <Grid item xs={12} container justifyContent="center">
                            <Route exact path="/find-people">
                                <FindPeople />
                            </Route>
                        </Grid>

                        <Grid item xs={12} container justifyContent="center">
                            <Route exact path="/">
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    url={this.state.profilePic}
                                    bio={this.state.bio}
                                    userId={this.state.userId}
                                    toggleUploader={this.toggleUploader}
                                    setBio={this.setBio}
                                />
                                {this.state.uploaderVisible && (
                                    <Uploader
                                        toggleUploader={this.toggleUploader}
                                        updateProfilePic={this.updateProfilePic}
                                    />
                                )}
                            </Route>
                        </Grid>
                    </BrowserRouter>
                </Grid>
            </div>
        );
    }
}

export default App;
