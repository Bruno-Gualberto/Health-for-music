import { Grid } from "@mui/material";

const ProfilePic = ({ url, first, last, toggleUploader, width }) => {
    url = url || "default-picture.png";

    return (
        <Grid item xs={12} container justifyContent="center">
            <img
                onClick={toggleUploader}
                style={{ width: width, objectFit: "cover" }}
                src={url}
                alt={`${first} ${last}`}
            />
        </Grid>
    );
};

export default ProfilePic;
