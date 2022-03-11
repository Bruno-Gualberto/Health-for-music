const ProfilePic = ({ url, first, last, toggleUploader }) => {
    url = url || "default-picture.png";
    
    return (
        <div onClick={toggleUploader}>
            Profile-Pic
            <img src={url} alt={`${first} ${last}`} />
        </div>
    )
}

export default ProfilePic;