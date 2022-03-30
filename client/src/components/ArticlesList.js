import { Card, Grid, Stack, Typography, Button } from "@mui/material";

const ArticlesList = ({ article }) => {
    return (
        <Card elevation={3} sx={{ mb: 2, p: 2 }}>
            <Grid container columnSpacing={2}>
                <Grid item>
                    <img
                        className="articleList-img-card"
                        src={article.articlePic || "/default-img.png"}
                    />
                </Grid>
                <Grid item xs={8}>
                    <Stack sx={{ height: "100%" }}>
                        <Typography variant="h5" sx={{ color: "primary.dark" }}>
                            {article.title}
                        </Typography>
                        <Typography sx={{ color: "#818181" }}>
                            {article.subtitle}
                        </Typography>
                        <Stack
                            justifyContent="flex-end"
                            sx={{ height: "100%" }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ lineHeight: 1, color: "#818181" }}
                            >
                                Doctor {article.first} {article.last}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#818181" }}
                            >
                                Specialist in {article.specialties}
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs
                    container
                    alignItems="flex-end"
                    justifyContent="flex-end"
                >
                    <Button
                        color="secondary"
                        href={`/article/${article.articleId}`}
                        variant="contained"
                        sx={{ boxShadow: 3 }}
                    >
                        Read more
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ArticlesList;
