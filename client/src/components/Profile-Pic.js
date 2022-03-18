const ProfilePic = ({ url, first, last, toggleUploader, width }) => {
    return (
        <img
            onClick={toggleUploader}
            style={{ width: width, objectFit: "cover", maxHeight: "350px" }}
            src={url || "/default-picture.png"}
            alt={`${first} ${last}`}
            className="hover-profile-pic"
        />
    );
};

export default ProfilePic;
