import { Component } from "react";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            draftBio: "",
        };
        
        this.renderBioEditor = this.renderBioEditor.bind(this);
        this.showEditor = this.showEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addUpdateBio = this.addUpdateBio.bind(this);
    }

    showEditor() {
        this.setState({ editing: true })
    }

    handleChange({ target }) {
        this.setState({ draftBio: target.value })
    }

    addUpdateBio() {
        fetch("/user/add-update-bio.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bio: this.state.draftBio }),
        })
            .then((resp) => resp.json())
            .then((data) => {
                this.props.setBio(data.bio)
                this.setState({ editing: false });
            })
            .catch((err) => console.log("error POST add bio", err));
    }
    
    renderBioEditor() {
        if (this.state.editing) {
            return (
                <div>
                    <textarea 
                        name="bio"
                        placeholder="Add your bio here" 
                        defaultValue={this.props.bio}
                        onChange={this.handleChange}
                    />
                    <button onClick={this.addUpdateBio} >SAVE</button>
                </div>
            )
        } else if (!this.state.editing && this.props.bio) {
            return (
                <div>
                    <p>{this.props.bio}</p>
                    <button onClick={this.showEditor}>EDIT</button>
                </div>
            )
        } else if (!this.state.editing && !this.props.bio) {
            return (
                <div>
                    <p>You don't have a bio yet. Add one!</p>
                    <button onClick={this.showEditor}>ADD BIO</button>
                </div>
            )
        }
    }

    render() {
        return (
            <>
                {this.renderBioEditor()}
            </>
        )
    }
}

export default BioEditor;