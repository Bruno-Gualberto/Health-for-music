import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import Logo from "./Logo";
import {
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
    Button,
    Stack,
} from "@mui/material";
import { Logout, Search, Forum } from "@mui/icons-material";

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
    const userData = useSelector((state) => state.userData);

    const [loggedOut, setLoggedOut] = useState(false);

    return (
        <>
            <HideOnScroll {...props}>
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{ px: 21, width: 1 }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            LOGO
                        </Typography>
                        <Stack direction="row" spacing={2}>
                            {userData.id && (
                                <>
                                    <Button
                                        href="/articles"
                                        sx={{ color: "white" }}
                                    >
                                        Articles
                                    </Button>
                                    <Button sx={{ color: "white" }}>
                                        Doctors
                                    </Button>
                                    <Button
                                        href="/logout"
                                        sx={{ color: "white" }}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </>
    );
};

export default Header;
