const Logo = (props) => {
    return (
        <div>
            <img
                src="/logo.png"
                alt="socialnetwork logo"
                style={{ height: props.height }}
            />
        </div>
    );
};

export default Logo;
