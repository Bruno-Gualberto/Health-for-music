import { useState, useEffect } from "react";
import ArticlesList from "./ArticlesList";

import {
    Stack,
    Typography,
    Card,
    Grid,
    TextField,
    Button,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [moreButton, setMoreButton] = useState(true);

    useEffect(() => {
        (async () => {
            const data = await fetch("/articles.json");
            const articlesResp = await data.json();
            setArticles(articlesResp);
            articlesResp.filter(
                (article) => article.articleId === article.lowestId
            ).length
                ? setMoreButton(false)
                : setMoreButton(true);
        })();
    }, []);
    const handleClick = async () => {
        const smallestId = articles[articles.length - 1].articleId;
        const data = await fetch(`/more-articles/${smallestId}.json`);
        const moreArticles = await data.json();
        setArticles([...articles, ...moreArticles]);
        moreArticles.filter((article) => article.articleId === article.lowestId)
            .length
            ? setMoreButton(false)
            : setMoreButton(true);
    };

    return (
        <Stack sx={{ px: 24, mb: 4, minHeight: "83.5vh" }}>
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
                    width: 1,
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
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            color="secondary"
                            variant="contained"
                            fullWidth
                            sx={{ boxShadow: 3 }}
                        >
                            Find articles
                        </Button>
                    </Grid>
                    <Grid item>selects</Grid>
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
