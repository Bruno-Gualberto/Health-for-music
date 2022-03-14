const ProfilePic = ({ url, first, last, toggleUploader }) => {
    url = url || "default-picture.png";
    
    return (
        <div onClick={toggleUploader}>
            <img style={{height: "150px"}} src={url} alt={`${first} ${last}`} />
        </div>
    )
}

export default ProfilePic;