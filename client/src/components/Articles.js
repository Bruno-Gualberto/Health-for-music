import { useState, useEffect } from "react";
import ArticlesList from "./ArticlesList";

import {
    Stack,
    Typography,
    Card,
    Grid,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [moreButton, setMoreButton] = useState(true);
    const [title, setTitle] = useState("");
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");

    useEffect(() => {
        (async () => {
            const data = await fetch("/all-articles.json");
            const articlesResp = await data.json();
            setArticles(articlesResp);
            articlesResp.filter(
                (article) => article.articleId === article.lowestId
            ).length
                ? setMoreButton(false)
                : setMoreButton(true);
        })();
    }, []);

    console.log(articles);

    const filterByTitle = (article, title) =>
        article.title.toLowerCase().includes(title.toLowerCase());

    const filterBySpecialty = (article, specialty) =>
        article.specialties.toLowerCase().includes(specialty.toLowerCase());

    const filterByName = ({ first, last }, name) => {
        let fullName = `${first} ${last}`;
        return fullName.toLowerCase().includes(name.toLowerCase());
    };

    const handleSearch = () => {
        let result = [...articles];
        if (title && specialty && name) {
            result = result.filter((article) => {
                return (
                    filterByTitle(article, title) &&
                    filterBySpecialty(article, specialty) &&
                    filterByName(article, name)
                );
            });
        } else if (title && specialty) {
            result = result.filter((article) => {
                return (
                    filterByTitle(article, title) &&
                    filterBySpecialty(article, specialty)
                );
            });
        } else if (title && name) {
            result = result.filter((article) => {
                return (
                    filterByTitle(article, title) && filterByName(article, name)
                );
            });
        } else if (name && specialty) {
            result = result.filter((article) => {
                return (
                    filterByName(article, name) &&
                    filterBySpecialty(article, specialty)
                );
            });
        } else if (title) {
            result = result.filter((article) => filterByTitle(article, title));
        } else if (specialty) {
            result = result.filter((article) =>
                filterBySpecialty(article, specialty)
            );
        } else if (name) {
            result = result.filter((article) => filterByName(article, name));
        }
        setArticles(result);
    };

    const handleClick = async () => {
        const smallestId = articles[articles.length - 1].articleId;
        const data = await fetch(`/more-all-articles/${smallestId}.json`);
        const moreArticles = await data.json();
        setArticles([...articles, ...moreArticles]);
        moreArticles.filter((article) => article.articleId === article.lowestId)
            .length
            ? setMoreButton(false)
            : setMoreButton(true);
    };

    return (
        <Stack sx={{ px: 24, mb: 4 }}>
            <Typography variant="h3" sx={{ color: "primary.dark", mt: 2 }}>
                Articles
            </Typography>
            <Typography variant="body1" sx={{ color: "primary.dark" }}>
                Find articles about issues, treatments, prevention, posture and
                more.
            </Typography>
            <Card
                elevation={0}
                sx={{
                    p: 1,
                    my: 3,
                    bgcolor: "primary.dark",
                    color: "#ffffff",
                }}
            >
                <Grid container spacing={1}>
                    <Grid item xs={10}>
                        <TextField
                            size="small"
                            type="text"
                            name="findArticles"
                            fullWidth
                            placeholder="Type here to find articles"
                            value={title}
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            color="secondary"
                            variant="contained"
                            fullWidth
                            sx={{ boxShadow: 3 }}
                            onClick={handleSearch}
                        >
                            Find articles
                        </Button>
                    </Grid>
                    <Grid item>
                        <TextField
                            className="select"
                            size="small"
                            label="Select a doctor"
                            select
                            value={name}
                            onChange={({ target }) => setName(target.value)}
                            sx={{
                                minWidth: "200px",
                                mr: 1,
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Spider Doctor">
                                Spider Doctor
                            </MenuItem>
                            <MenuItem value="Gandalf The Grey">
                                Gandalf The Grey
                            </MenuItem>
                            <MenuItem value="Ashton NotKutcher">
                                Ashton NotKutcher
                            </MenuItem>
                            <MenuItem value="Bruno Gualberto">
                                Bruno Gualberto
                            </MenuItem>
                        </TextField>
                        <TextField
                            className="select"
                            size="small"
                            label="Select health area"
                            select
                            value={specialty}
                            onChange={({ target }) =>
                                setSpecialty(target.value)
                            }
                            sx={{ minWidth: "200px" }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Musicians health">
                                Musicians health
                            </MenuItem>
                            <MenuItem value="Ears">Ears</MenuItem>
                            <MenuItem value="Mental health">
                                Mental health
                            </MenuItem>
                            <MenuItem value="Hand">Hand</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Card>

            <Typography
                variant="h3"
                sx={{ fontWeight: "light", color: "primary.dark", mb: 3 }}
            >
                Suggestions for <strong>you</strong>
            </Typography>
            {articles &&
                articles.map((article) => (
                    <ArticlesList key={article.articleId} article={article} />
                ))}
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

export default Articles;
