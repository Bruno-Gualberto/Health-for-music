const ProfilePic = ({ url, first, last, toggleUploader, width }) => {
    return (
        <img
            onClick={toggleUploader}
            style={{ width: width, objectFit: "cover" }}
            src={url || "/default-picture.png"}
            alt={`${first} ${last}`}
        />
    );
};

export default ProfilePic;
