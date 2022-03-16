import ProfilePic from "./Profile-Pic.js";
import BioEditor from "./BioEditor.js";
import { useState } from "react";
import { Card, Grid, Fade } from "@mui/material";

const Profile = (props) => {
    const [toFade, setToFade] = useState(true);
    return (
        <Card elevation={2} sx={{ p: 4, width: 2 / 3 }}>
            <Grid
                container
                spacing={2}
                style={{ marginLeft: "-8px" }}
                sx={{ width: 1 }}
                justifyContent="space-around"
            >
                <Fade mountOnEnter in={toFade} {...{ timeout: 500 }}>
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        md={6}
                        container
                        alignItems="flex-end"
                    >
                        <ProfilePic
                            first={props.first}
                            last={props.last}
                            url={props.url}
                            toggleUploader={props.toggleUploader}
                            width="100%"
                        />
                    </Grid>
                </Fade>
                <Fade mountOnEnter in={toFade} {...{ timeout: 500 }}>
                    <Grid item xs={12} sm={12} md={6}>
                        <BioEditor
                            bio={props.bio}
                            setBio={props.setBio}
                            userId={props.userId}
                        />
                    </Grid>
                </Fade>
            </Grid>
        </Card>
    );
};

export default Profile;
