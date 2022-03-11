import { Component } from 'react';
import ProfilePic from "./Profile-Pic";
import Logo from "./Logo";
import Uploader from "./Uploader";

class App extends Component {
    constructor() {
        super()
        this.state = {
            first: "",
            last: "",
            email: "",
            profilePic: "",
            uploaderVisible: false
        }
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.toggleUploader = this.toggleUploader.bind(this);
    }

    componentDidMount() {
        fetch("/user/data.json").then(resp => resp.json())
        .then(data => {
            this.setState(data, () =>{
            });
        }).catch(err => console.log("error getting user info:", err))
    }

    toggleUploader() {
        this.setState({ uploaderVisible: !this.state.uploaderVisible });
    }

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl})
    }

    render() {
        return (
            <div>
                App
                <Logo />
                <ProfilePic 
                    // {...this.state}
                    url={this.state.profilePic} 
                    first={this.state.first} 
                    last={this.state.last} 
                    toggleUploader={this.toggleUploader}
                />
                { this.state.uploaderVisible && <Uploader toggleUploader={this.toggleUploader} 
                updateProfilePic={this.updateProfilePic}/> }
            </div>
        )
    }
}

export default App;