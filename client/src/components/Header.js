import Logo from "./Logo";
import {
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
} from "@mui/material";

function HideOnScroll(props) {
    const { children } = props;
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
                <AppBar position="sticky" elevation={0} sx={{ mb: 2 }}>
                    <Toolbar>
                        <Logo height="50px" />
                        <Typography sx={{ ml: 1 }} variant="h6" component="h6">
                            Socialnetwork
                        </Typography>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </>
    );
};

export default Header;
