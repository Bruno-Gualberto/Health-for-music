import ProfilePic from "./Profile-Pic.js";
import BioEditor from "./BioEditor.js";

const Profile = (props) => {
    return (
        <div>
            <ProfilePic
                first={props.first}
                last={props.last}
                url={props.url}
                toggleUploader={props.toggleUploader}
            />
            <BioEditor 
                bio={props.bio}
                setBio={props.setBio}
                userId={props.userId}
            />
        </div>
    );
}

export default Profile;