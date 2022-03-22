import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
    Box,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    Card,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { overflow, textOverflow } from "@mui/system";

const FindPeople = () => {
    const [searchTerm, setSearchTerm] = useState();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        let abort = false;
        (async () => {
            if (!searchTerm) {
                try {
                    let lastUsers = await fetch("/last-users.json").then(
                        (resp) => {
                            return resp.json();
                        }
                    );
                    setUsers(lastUsers.users);
                } catch {
                    setError(true);
                }
            } else {
                try {
                    let searchedUsers = await fetch(
                        `/searched-users?search=${searchTerm}`
                    ).then((resp) => {
                        return resp.json();
                    });
                    if (!abort) {
                        setUsers(searchedUsers.users);
                    }
                } catch {
                    setError(true);
                }
            }

            return () => {
                abort = true;
            };
        })();
    }, [searchTerm]);

    return (
        <Box
            sx={{
                p: 3,
                width: 1,
            }}
        >
            <Typography variant="h4" sx={{ mb: 2 }}>
                Looking for someone?
            </Typography>
            <Grid container sx={{ width: 1 }} item xs={12} sm={6} md={4}>
                <TextField
                    variant="outlined"
                    label="Person's name"
                    placeholder="Person's name"
                    type="text"
                    name="searchTerm"
                    fullWidth
                    onChange={({ target }) => setSearchTerm(target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Grid>
            <Grid container spacing={4} sx={{ mt: 2 }}>
                {!users.length ? (
                    <Typography variant="body1" sx={{ ml: "32px" }}>
                        Sorry, no users found 😭
                    </Typography>
                ) : (
                    users.map((user) => {
                        return (
                            <Grid item xs={12} sm={6} md={4} key={user.id}>
                                <Card elevation={6} className="card">
                                    <Link
                                        to={`/user/${user.id}`}
                                        style={{
                                            height: "150px",
                                        }}
                                        className="link-card"
                                    >
                                        <Grid container alignItems="center">
                                            <img
                                                src={
                                                    user.profilePic ||
                                                    "/default-picture.png"
                                                }
                                                style={{
                                                    objectFit: "cover",
                                                    height: "150px",
                                                    width: "150px",
                                                    borderRadius: "5px 0 0 5px",
                                                }}
                                            />
                                            <Typography
                                                variant="h5"
                                                color="white"
                                                sx={{
                                                    ml: 2,
                                                }}
                                            >
                                                {user.first} {user.last}
                                            </Typography>
                                        </Grid>
                                    </Link>
                                </Card>
                            </Grid>
                        );
                    })
                )}
            </Grid>
        </Box>
    );
};

export default FindPeople;
