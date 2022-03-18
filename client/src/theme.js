import { createTheme } from "@mui/material/styles";

let theme = createTheme({
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: "#fff8cd",
                },
            },
        },
    },
    palette: {
        primary: {
            light: "#96b7a2",
            main: "#829b86",
        },
        secondary: {
            light: "#b4b969",
            main: "#a6aa56",
        },
        error: {
            main: "#e35241",
        },
        // background: {
        //     card: "#fff8cd",
        // },
    },
});

export default theme;
