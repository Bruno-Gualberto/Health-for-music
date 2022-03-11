import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        boxShadow: "none"
    },
    title: {
        flexGrow: 1
    }
}))

const Header = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="sticky" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>Socialnework</Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;