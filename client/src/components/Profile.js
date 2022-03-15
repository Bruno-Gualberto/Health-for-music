import ProfilePic from "./Profile-Pic.js";
import BioEditor from "./BioEditor.js";
import { Card, Grid } from "@mui/material";

const Profile = (props) => {
    return (
        <Card elevation={2} sx={{ p: 4, width: 1 / 2 }}>
            <Grid container columnSpacing={2} sx={{ width: 1 }}>
                <Grid item xs={12} sm={6}>
                    <ProfilePic
                        first={props.first}
                        last={props.last}
                        url={props.url}
                        toggleUploader={props.toggleUploader}
                        width="100%"
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <BioEditor
                        bio={props.bio}
                        setBio={props.setBio}
                        userId={props.userId}
                    />
                </Grid>
            </Grid>
        </Card>
    );
};

export default Profile;
