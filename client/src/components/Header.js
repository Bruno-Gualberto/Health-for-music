import {
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
} from "@mui/material";

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger();

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

const Header = (props) => {
    return (
        <>
            <HideOnScroll {...props}>
                <AppBar position="sticky" elevation={0}>
                    <Toolbar>
                        <Typography variant="h6">Socialnetwork</Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </>
    );
};

export default Header;
