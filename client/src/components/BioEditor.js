import { Component } from "react";
import {
    Paper,
    Button,
    Typography,
    TextField,
    Grid,
    Fade,
} from "@mui/material";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            draftBio: this.props.bio,
            fade: true,
        };

        this.renderBioEditor = this.renderBioEditor.bind(this);
        this.showEditor = this.showEditor.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addUpdateBio = this.addUpdateBio.bind(this);
        this.closeEditor = this.closeEditor.bind(this);
    }

    closeEditor() {
        this.setState({ editing: false });
    }

    showEditor() {
        this.setState({ editing: true });
        this.setState({ draftBio: this.props.bio });
    }

    handleChange({ target }) {
        this.setState({ draftBio: target.value });
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
                this.props.setBio(data.bio);
                this.setState({ editing: false });
            })
            .catch((err) => console.log("error POST add bio", err));
    }

    renderBioEditor() {
        if (this.state.editing) {
            return (
                <Grid
                    container
                    rowSpacing={1}
                    direction="column"
                    justifyContent="space-between"
                    sx={{ height: 1, flexWrap: "nowrap" }}
                >
                    <Grid item xs={1}>
                        <Typography variant="h5" component="h1">
                            Here is my bio!
                        </Typography>
                    </Grid>
                    <Grid item xs={9} sx={{ width: 1 }}>
                        <Fade in={this.state.fade} {...{ timeout: 250 }}>
                            <TextField
                                sx={{ mb: 1, height: 1 }}
                                fullWidth
                                multiline
                                rows={4}
                                name="bio"
                                placeholder="Add your bio here"
                                defaultValue={this.props.bio}
                                onChange={this.handleChange}
                            />
                        </Fade>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        container
                        alignItems="flex-end"
                        spacing={2}
                    >
                        <Grid item xs={12} sm={6}>
                            <Fade in={this.state.fade} {...{ timeout: 500 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={this.addUpdateBio}
                                >
                                    Save
                                </Button>
                            </Fade>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Fade in={this.state.fade} {...{ timeout: 750 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={this.closeEditor}
                                >
                                    Cancel
                                </Button>
                            </Fade>
                        </Grid>
                    </Grid>
                </Grid>
            );
        } else if (!this.state.editing && this.props.bio) {
            return (
                <Grid
                    container
                    justifyContent="space-between"
                    rowSpacing={1}
                    direction="column"
                    sx={{ height: 1, flexWrap: "nowrap" }}
                >
                    <Grid item xs={1}>
                        <Typography variant="h5" component="h1">
                            Here is my bio!
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Fade
                            in={this.state.fade}
                            mountOnEnter
                            {...{ timeout: 500 }}
                        >
                            <Paper
                                sx={{
                                    bgcolor: "#e9e9e9",
                                    height: 1,
                                    maxHeight: 262,
                                    overflow: "auto",
                                }}
                                elevation={3}
                            >
                                <Typography
                                    variant="body1"
                                    component="p"
                                    sx={{ p: 1, overflow: "auto" }}
                                >
                                    {this.props.bio}
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        sx={{ width: 1 }}
                        container
                        justifyContent="center"
                    >
                        <Fade
                            in={this.state.fade}
                            mountOnEnter
                            {...{ timeout: 500 }}
                        >
                            <Button
                                sx={{ width: 1 / 2 }}
                                variant="contained"
                                onClick={this.showEditor}
                            >
                                Edit
                            </Button>
                        </Fade>
                    </Grid>
                </Grid>
            );
        } else if (!this.state.editing && !this.props.bio) {
            return (
                <Grid
                    container
                    direction="column"
                    rowSpacing={1}
                    justifyContent="space-between"
                    sx={{ height: 1, flexWrap: "nowrap" }}
                >
                    <Grid item xs={1}>
                        <Typography variant="h5" component="h1">
                            Here is my bio!
                        </Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <Fade
                            in={this.state.fade}
                            mountOnEnter
                            {...{ timeout: 500 }}
                        >
                            <Paper
                                sx={{ bgcolor: "#e9e9e9", height: 1 }}
                                elevation={3}
                            >
                                <Typography
                                    variant="body1"
                                    component="p"
                                    sx={{ p: 1 }}
                                >
                                    You don't have a bio yet. Add one!
                                </Typography>
                            </Paper>
                        </Fade>
                    </Grid>
                    <Grid
                        item
                        xs={1}
                        sx={{ width: 1 }}
                        container
                        justifyContent="center"
                    >
                        <Fade
                            in={this.state.fade}
                            mountOnEnter
                            {...{ timeout: 500 }}
                        >
                            <Button
                                sx={{ width: 1 / 2 }}
                                variant="contained"
                                onClick={this.showEditor}
                            >
                                ADD BIO
                            </Button>
                        </Fade>
                    </Grid>
                </Grid>
            );
        }
    }

    render() {
        return <>{this.renderBioEditor()}</>;
    }
}

export default BioEditor;
