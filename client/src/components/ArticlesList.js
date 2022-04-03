import { Card, Grid, Stack, Typography, Button } from "@mui/material";

const ArticlesList = ({ article, editMode }) => {
    return (
        <Card elevation={3} sx={{ mb: 2, p: 2 }}>
            <Grid container columnSpacing={2}>
                <Grid item>
                    <img
                        className="articleList-img-card"
                        src={article.articlePic || "/default-img.png"}
                    />
                </Grid>
                <Grid item xs container>
                    <Grid item xs={10}>
                        <Typography variant="h5" sx={{ color: "primary.dark" }}>
                            {article.title}
                        </Typography>
                        <Typography sx={{ color: "#818181" }}>
                            {article.subtitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={2}></Grid>

                    <Grid
                        item
                        xs={4}
                        container
                        direction="column"
                        justifyContent="flex-end"
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{ lineHeight: 1, color: "#818181" }}
                        >
                            Dr. {article.first} {article.last}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#818181" }}>
                            Specialist in {article.specialties}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        container
                        alignItems="flex-end"
                        justifyContent="flex-end"
                    >
                        {editMode ? (
                            <Stack
                                direction="row"
                                alignItems="flex-end"
                                justifyContent="flex-end"
                                spacing={1}
                            >
                                <Button
                                    href={`/create-edit-article/${article.articleId}`}
                                    color="secondary"
                                    variant="contained"
                                    disableElevation
                                >
                                    Edit article
                                </Button>
                            </Stack>
                        ) : (
                            <Button
                                color="secondary"
                                href={`/article/${article.articleId}`}
                                variant="contained"
                                disableElevation
                            >
                                Read more
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ArticlesList;
