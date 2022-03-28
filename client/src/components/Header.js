import { useState } from "react";
import { useHistory } from "react-router-dom";
// import Logo from "./Logo";
import {
    AppBar,
    Toolbar,
    Typography,
    useScrollTrigger,
    Slide,
    Box,
    Tooltip,
    IconButton,
    Avatar,
    Menu,
    MenuItem,
    Button,
    Divider,
    ListItemIcon,
} from "@mui/material";
import {
    Logout,
    Search,
    AccountCircle,
    People,
    Forum,
} from "@mui/icons-material";

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
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [loggedOut, setLoggedOut] = useState(false);

    const history = useHistory();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <HideOnScroll {...props}>
                <AppBar position="sticky" elevation={0} sx={{ mb: 2 }}>
                    <Toolbar>
                        {/* <Logo height="50px" /> */}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                                sx={{ ml: 3 }}
                                variant="h6"
                                component="h6"
                            >
                                {props.loggedIn
                                    ? `Welcome to Socialnetwork, ${props.first}!`
                                    : "Socialnetwork"}
                            </Typography>
                        </Box>
                        {props.loggedIn && (
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <Avatar
                                            alt={`${props.first} ${props.last}`}
                                            src={
                                                props.profilePic ||
                                                "/default-picture.png"
                                            }
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    keepMounted
                                    sx={{ mt: 5 }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Button
                                            href="/"
                                            sx={{
                                                width: 1,
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <ListItemIcon>
                                                <AccountCircle />
                                            </ListItemIcon>
                                            Profile
                                        </Button>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Button
                                            href="/friends"
                                            sx={{
                                                width: 1,
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <ListItemIcon>
                                                <People />
                                            </ListItemIcon>
                                            Friends
                                        </Button>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Button
                                            href="/find-people"
                                            sx={{
                                                width: 1,
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Search />
                                            </ListItemIcon>
                                            Search People
                                        </Button>
                                    </MenuItem>

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Button
                                            href="/chat"
                                            sx={{
                                                width: 1,
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Forum />
                                            </ListItemIcon>
                                            Community chat
                                        </Button>
                                    </MenuItem>

                                    <Divider />

                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Button
                                            href="/logout"
                                            sx={{
                                                width: 1,
                                                justifyContent: "flex-start",
                                            }}
                                        >
                                            <ListItemIcon>
                                                <Logout />
                                            </ListItemIcon>
                                            Logout
                                        </Button>
                                    </MenuItem>
                                </Menu>
                            </Box>
                        )}
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
        </>
    );
};

export default Header;
