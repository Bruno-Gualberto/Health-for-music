import { Box, AppBar, Toolbar } from "@mui/material";

const Footer = () => {
    return (
        <AppBar position="static" color="secondary" elevation={0}>
            <Toolbar sx={{ justifyContent: "center", bottom: 0 }}>
                Footer
            </Toolbar>
        </AppBar>
    );
};

export default Footer;
