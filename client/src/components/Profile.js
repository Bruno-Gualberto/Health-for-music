import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ArticlesList from "./ArticlesList";
import ConversationsList from "./ConversationsList";

import {
    Stack,
    Grid,
    Card,
    Typography,
    Button,
    TextField,
    Box,
    CircularProgress,
} from "@mui/material";
import { Circle, KeyboardArrowDown, Add } from "@mui/icons-material";
const Profile = () => {
    const [inputsInfo, setInputsInfo] = useState({
        first: "",
        last: "",
        specialties: "",
        email: "",
        phone: "",
        address: "",
        cityAndCountry: "",
        bio: "",
        doctorPic: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [pic, setPic] = useState("");
    const [articles, setArticles] = useState([]);
    const [moreButton, setMoreButton] = useState(false);
    const [userId, setUserId] = useState(0);
    const [allUsers, setAllUsers] = useState([]);

    let {
        first,
        last,
        specialties,
        email,
        phone,
        address,
        cityAndCountry,
        bio,
        doctorPic,
    } = inputsInfo;

    const formatArticles = (array, doc) => {
        return array.map((item) => {
            return {
                ...item,
                first: doc.first,
                last: doc.last,
                specialties: doc.specialties,
            };
        });
    };

    useEffect(() => {
        (async () => {
            const respUser = await fetch("/user.json");
            const dataUser = await respUser.json();
            setInputsInfo({
                first: dataUser.first,
                last: dataUser.last,
                specialties: dataUser.specialties,
                email: dataUser.email,
                phone: dataUser.phone,
                address: dataUser.address,
                cityAndCountry: dataUser.cityAndCountry,
                bio: dataUser.bio,
                doctorPic: dataUser.doctorPic,
            });
            setUserId(dataUser.id);

            const respArticles = await fetch("/doctor-own-articles.json");
            const docArticles = await respArticles.json();

            if (docArticles.length) {
                setArticles(formatArticles(docArticles, dataUser));
                docArticles.filter(
                    (article) => article.articleId === article.lowestId
                ).length
                    ? setMoreButton(false)
                    : setMoreButton(true);
            }

            const respAll = await fetch("/all-users.json");
            const allUsers = await respAll.json();
            setAllUsers(allUsers);
        })();
    }, []);

    const handleInputChange = (target) => {
        setInputsInfo({ ...inputsInfo, [target.name]: target.value });
    };

    const handleProfilePicChange = (target) => {
        setPic(target.files[0]);
    };

    const handleClick = async () => {
        const smallestId = articles[articles.length - 1].articleId;
        const data = await fetch(`/more-doctor-articles/${smallestId}.json`);
        const moreArticles = await data.json();

        const formatedMoreArticles = formatArticles(moreArticles, inputsInfo);
        setArticles([...articles, ...formatedMoreArticles]);

        moreArticles.filter((article) => article.articleId === article.lowestId)
            .length
            ? setMoreButton(false)
            : setMoreButton(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (pic) {
            const fd = new FormData();
            fd.append("first", first);
            fd.append("last", last);
            fd.append("specialties", specialties);
            fd.append("file", pic);
            fd.append("email", email);
            fd.append("phone", phone);
            fd.append("address", address);
            fd.append("cityAndCountry", cityAndCountry);
            fd.append("bio", bio);

            const resp = await fetch("/edit-profile-with-pic.json", {
                method: "POST",
                body: fd,
            });
            const data = await resp.json();

            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else {
                setInputsInfo({ ...data });
                setLoading(false);
            }
        } else {
            const resp = await fetch("/edit-profile-text-only.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    first,
                    last,
                    specialties,
                    email,
                    phone,
                    address,
                    cityAndCountry,
                    bio,
                }),
            });
            const data = await resp.json();

            if (data.error) {
                setError(data.error);
                setLoading(false);
            } else {
                setInputsInfo({ ...data });
                setLoading(false);
            }
        }
    };

    const allMessages = useSelector((state) => {
        return state.privateMessages.filter((message) => {
            return (
                message.loggedUserId === userId ||
                message.otherUserId === userId
            );
        });
    });

    const filterUsers = (arrUsers) => {
        return arrUsers.map((user) => {
            return allMessages.filter((message) => {
                return (
                    (user.id === message.loggedUserId ||
                        user.id === message.otherUserId) &&
                    user.id !== userId
                );
            });
        });
    };

    const usersWithChat = filterUsers(allUsers).filter((arr) => arr.length);
    const lastMsgEachUser = usersWithChat.map((arr) => arr.slice(0, 1)).flat();

    const userAndMsg = lastMsgEachUser
        .map((msg) => {
            return allUsers.map((user) => {
                if (
                    (user.id === msg.loggedUserId ||
                        user.id === msg.otherUserId) &&
                    user.id !== userId
                ) {
                    return { ...user, ...msg, userId };
                }
            });
        })
        .flat()
        .filter((item) => item)
        .sort((a, b) => b.id - a.id);

    return (
        <Stack sx={{ px: 24, mb: 4, color: "primary.dark" }}>
            <Typography variant="h3" sx={{ fontWeight: "light", mt: 4, mb: 2 }}>
                Your <strong>profile</strong>
            </Typography>
            <Card elevation={3} sx={{ p: 4 }}>
                <form>
                    <Grid container spacing={4}>
                        <Grid item xs={6} sx={{ color: "primary.dark" }}>
                            <Typography sx={{ mb: 1 }}>
                                Profile picture
                            </Typography>
                            <Stack direction="row" spacing={2}>
                                <img
                                    className="doc-pic-profile"
                                    src={doctorPic || "/default-picture.png"}
                                />
                                <Stack spacing={1} justifyContent="flex-end">
                                    <Button
                                        disableElevation
                                        variant="contained"
                                        color="secondary"
                                        component="label"
                                    >
                                        {!pic ? (
                                            "Upload picture"
                                        ) : (
                                            <div
                                                style={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: "150px",
                                                }}
                                            >
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        fontSize: "0.875rem",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {pic.name}
                                                </Typography>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            hidden
                                            name="doctorPic"
                                            onChange={({ target }) =>
                                                handleProfilePicChange(target)
                                            }
                                        />
                                    </Button>
                                </Stack>
                            </Stack>

                            {error && (
                                <Typography
                                    sx={{
                                        color: "error.main",
                                        mt: 2,
                                        mb: 1,
                                    }}
                                >
                                    {error}
                                </Typography>
                            )}
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Box width="50%">
                                    <Typography>First name</Typography>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={first}
                                        type="text"
                                        name="first"
                                        placeholder="First name"
                                        onChange={({ target }) =>
                                            handleInputChange(target)
                                        }
                                    />
                                </Box>
                                <Box width="50%">
                                    <Typography>Last name</Typography>
                                    <TextField
                                        size="small"
                                        fullWidth
                                        value={last}
                                        type="text"
                                        name="last"
                                        placeholder="Last name"
                                        onChange={({ target }) =>
                                            handleInputChange(target)
                                        }
                                    />
                                </Box>
                            </Stack>

                            <Typography sx={{ mt: 1 }}>
                                Area of specialization
                            </Typography>
                            <TextField
                                type="text"
                                name="specialties"
                                fullWidth
                                value={specialties}
                                size="small"
                                placeholder="Area of specialization"
                                onChange={({ target }) =>
                                    handleInputChange(target)
                                }
                            />

                            <Typography sx={{ mt: 1 }}>E-mail</Typography>
                            <TextField
                                type="email"
                                name="email"
                                fullWidth
                                value={email}
                                size="small"
                                placeholder="Ex: example@mail.com"
                                onChange={({ target }) =>
                                    handleInputChange(target)
                                }
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ color: "primary.dark" }}>
                            <Stack height="100%">
                                <Typography>Phone</Typography>
                                <TextField
                                    type="text"
                                    name="phone"
                                    fullWidth
                                    value={phone}
                                    size="small"
                                    placeholder="Ex: +49 1234567890"
                                    onChange={({ target }) =>
                                        handleInputChange(target)
                                    }
                                />
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    sx={{ mt: 2 }}
                                >
                                    <Box width="50%">
                                        <Typography>Clinic address</Typography>
                                        <TextField
                                            type="text"
                                            name="address"
                                            fullWidth
                                            value={address}
                                            size="small"
                                            placeholder="Ex: Street 15, 12345"
                                            onChange={({ target }) =>
                                                handleInputChange(target)
                                            }
                                        />
                                    </Box>
                                    <Box width="50%">
                                        <Typography>
                                            City and country
                                        </Typography>
                                        <TextField
                                            type="text"
                                            name="cityAndCountry"
                                            fullWidth
                                            value={cityAndCountry}
                                            size="small"
                                            placeholder="Ex: Berlin, Germany"
                                            onChange={({ target }) =>
                                                handleInputChange(target)
                                            }
                                        />
                                    </Box>
                                </Stack>
                                <Typography sx={{ mt: 2 }}>
                                    Short description about yourself
                                </Typography>
                                <TextField
                                    type="text"
                                    name="bio"
                                    size="small"
                                    fullWidth
                                    value={bio}
                                    multiline
                                    rows={4}
                                    inputProps={{ maxLength: 255 }}
                                    helperText="Maximum characters allowed: 255"
                                    onChange={({ target }) =>
                                        handleInputChange(target)
                                    }
                                />
                                <Stack
                                    justifyContent="flex-end"
                                    alignItems="flex-end"
                                    sx={{ flexGrow: 1 }}
                                >
                                    {!loading ? (
                                        <Button
                                            disableElevation
                                            variant="contained"
                                            color="secondary"
                                            onClick={(e) => handleSubmit(e)}
                                        >
                                            Save changes
                                        </Button>
                                    ) : (
                                        <CircularProgress color="secondary" />
                                    )}
                                </Stack>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Typography variant="h3" sx={{ fontWeight: "light", mt: 4, mb: 2 }}>
                Your <strong>conversations</strong>
            </Typography>

            {userAndMsg.length ? (
                <Card
                    elevation={3}
                    sx={{ maxHeight: "350px", overflowY: "auto" }}
                >
                    {userAndMsg.length &&
                        userAndMsg.map((msg, i) => (
                            <ConversationsList key={i} lastMsg={msg} />
                        ))}
                </Card>
            ) : (
                <Typography>You don't have any conversation yet.</Typography>
            )}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Typography
                    variant="h3"
                    sx={{ fontWeight: "light", mt: 4, mb: 2 }}
                >
                    Published <strong>articles</strong>
                </Typography>
                <Button
                    href="/create-edit-article"
                    variant="contained"
                    startIcon={<Add />}
                    sx={{ boxShadow: 3 }}
                >
                    create new article
                </Button>
            </Stack>
            {articles.length ? (
                articles.map((article) => (
                    <ArticlesList
                        key={article.articleId}
                        article={article}
                        editMode={true}
                    />
                ))
            ) : (
                <Typography>
                    You don't have any ppublished article yet. Publish one now!
                </Typography>
            )}
            {moreButton && (
                <Button
                    endIcon={<KeyboardArrowDown />}
                    variant="outlined"
                    color="info"
                    sx={{ alignSelf: "center", mt: 2 }}
                    onClick={handleClick}
                >
                    More articles
                </Button>
            )}
        </Stack>
    );
};

export default Profile;
