import { Card, Grid, Stack, Typography, Box, Button } from "@mui/material";

const ArticlesList = ({ article }) => {
    // articleId: 2;
    // articlePic: null;
    // doctorId: 12;
    // first: "";
    // last: "";
    // lowestId: 1;
    // specialties: "";
    // subtitle: "";
    // title: "";
    return (
        <Card elevation={3} sx={{ mb: 2, p: 1 }}>
            <Grid container columnSpacing={1}>
                <Grid item>
                    <img
                        className="articleList-img-card"
                        src={article.articlePic || "/default-img.png"}
                    />
                </Grid>
                <Grid item xs>
                    <Stack sx={{ height: "100%" }}>
                        <Typography variant="h5" sx={{ color: "primary.dark" }}>
                            {article.title}
                        </Typography>
                        <Typography>{article.subtitle}</Typography>
                        <Stack
                            justifyContent="flex-end"
                            sx={{ height: "100%" }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{ lineHeight: 1 }}
                            >
                                Doctor {article.first} {article.last}
                            </Typography>
                            <Typography variant="body2">
                                Specialist in {article.specialties}
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item>
                    <Button variant="contained" sx={{ boxShadow: 2 }}>
                        Read more
                    </Button>
                </Grid>
            </Grid>
        </Card>
    );
};

export default ArticlesList;
