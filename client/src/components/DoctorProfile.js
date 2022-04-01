import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";

import ArticlesList from "./ArticlesList";

import { Box, Stack, Grid, Typography, Button, Card } from "@mui/material";
import { KeyboardArrowDown, Circle } from "@mui/icons-material";

const DoctorProfile = () => {
    const [ownProfile, setOwnProfile] = useState(false);
    const [moreButton, setMoreButton] = useState(false);
    const [doctor, setDoctor] = useState({});
    const [articles, setArticles] = useState([]);
    const { doctorId } = useParams();
    const history = useHistory();

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
            const resp = await fetch(`/doctor/${doctorId}.json`);
            const data = await resp.json();
            const { doctorInfo, ownProfile } = data;
            setDoctor(doctorInfo);

            const respArticles = await fetch(
                `/doctor-articles/${doctorId}.json`
            );
            const docArticles = await respArticles.json();
            setArticles(formatArticles(docArticles, doctorInfo));

            docArticles.filter(
                (article) => article.articleId === article.lowestId
            ).length
                ? setMoreButton(false)
                : setMoreButton(true);

            if (ownProfile) {
                setOwnProfile(true);
                history.push("/profile");
            }
        })();
    }, []);

    const isDoctor = useSelector((state) => state.userData.doctor);

    const handleClick = async () => {
        const smallestId = articles[articles.length - 1].articleId;
        const data = await fetch(
            `/more-doctor-articles/${doctorId}/${smallestId}.json`
        );
        const moreArticles = await data.json();

        const formatedMoreArticles = formatArticles(moreArticles, doctor);
        setArticles([...articles, ...formatedMoreArticles]);

        moreArticles.filter((article) => article.articleId === article.lowestId)
            .length
            ? setMoreButton(false)
            : setMoreButton(true);
    };

    return (
        <Stack
            sx={{ px: 24, mb: 4, minHeight: "83.5vh", color: "primary.dark" }}
        >
            <Box>
                <Typography variant="h3" sx={{ mt: 4 }}>
                    Dr. {doctor.first} {doctor.last}
                </Typography>
                <Typography>Specialist in {doctor.specialties}</Typography>
                <Typography sx={{ mb: 2 }}>{doctor.cityAndCountry}</Typography>
                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12}>
                        <Card elevation={3} sx={{ p: 4 }}>
                            <Stack direction="row" spacing={4}>
                                <img
                                    className="big-round-profile-pic"
                                    src={
                                        doctor.doctorPic ||
                                        "/default-picture.png"
                                    }
                                />
                                <Box>
                                    <Typography
                                        variant="h5"
                                        sx={{ color: "primary.dark", mb: 1 }}
                                    >
                                        A little about the doctor:
                                    </Typography>
                                    <Typography sx={{ color: "#818181" }}>
                                        {doctor.bio}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                        <Card elevation={3} sx={{ p: 4 }}>
                            <Typography
                                variant="h5"
                                sx={{ color: "primary.dark", mb: 2 }}
                            >
                                Contacts
                            </Typography>
                            <Stack
                                spacing={1}
                                direction="row"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Circle sx={{ color: "primary.dark" }} />
                                <Typography sx={{ color: "#818181" }}>
                                    {doctor.email}
                                </Typography>
                            </Stack>
                            <Stack
                                spacing={1}
                                direction="row"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Circle sx={{ color: "primary.dark" }} />
                                <Typography sx={{ color: "#818181" }}>
                                    {doctor.phone}
                                </Typography>
                            </Stack>
                            <Stack
                                spacing={1}
                                direction="row"
                                alignItems="center"
                                sx={{ mb: 2 }}
                            >
                                <Circle sx={{ color: "primary.dark" }} />
                                <Typography sx={{ color: "#818181" }}>
                                    {doctor.address}, {doctor.cityAndCountry}
                                </Typography>
                            </Stack>
                            {!isDoctor && (
                                <Button
                                    href={`/private-chat/${doctorId}`}
                                    disableElevation
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                >
                                    Open private chat
                                </Button>
                            )}
                        </Card>
                    </Grid>
                    <Grid item xs={8}>
                        <img className="fake-map-img" src="/fake-map.png" />
                    </Grid>
                </Grid>
            </Box>

            <Typography variant="h4" sx={{ mb: 2 }}>
                Dr. {doctor.first} {doctor.last}'s articles
            </Typography>

            {articles &&
                articles.map((article) => (
                    <ArticlesList key={article.articleId} article={article} />
                ))}

            {moreButton && (
                <Button
                    sx={{ alignSelf: "center", mt: 2 }}
                    endIcon={<KeyboardArrowDown />}
                    variant="outlined"
                    color="info"
                    onClick={handleClick}
                >
                    More articles
                </Button>
            )}
        </Stack>
    );
};

export default DoctorProfile;
