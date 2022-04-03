import { Box, Typography, Grid, Card, Button, Stack } from "@mui/material";

const Home = () => {
    return (
        <Box sx={{ pb: 2 }}>
            <img className="banner" src="/banner.png" />
            <Box sx={{ px: 24, mb: 6 }}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        width: "100%",
                        my: 10,
                    }}
                >
                    <Grid item>
                        <Stack
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ maxWidth: "200px" }}
                        >
                            <img src="/articles.svg" />
                            <Typography
                                sx={{ color: "#818181", textAlign: "center" }}
                            >
                                Find more than 300 articles written by our
                                selected doctors
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ maxWidth: "200px" }}
                        >
                            <img src="/local.svg" />
                            <Typography
                                sx={{ color: "#818181", textAlign: "center" }}
                            >
                                Find a good doctor near you easily
                            </Typography>
                        </Stack>
                    </Grid>
                    <Grid item>
                        <Stack
                            spacing={1}
                            alignItems="center"
                            justifyContent="center"
                            sx={{ maxWidth: "200px" }}
                        >
                            <img src="/edit.svg" />
                            <Typography
                                sx={{ color: "#818181", textAlign: "center" }}
                            >
                                Find a treatment or a prevention for your
                                specific case
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Box>
                    <Typography
                        variant="h3"
                        sx={{ color: "primary.dark", fontWeight: "light" }}
                    >
                        Where do I <strong>start</strong>?
                    </Typography>
                    <Grid
                        container
                        justifyContent="space-between"
                        sx={{ mt: 2 }}
                    >
                        <Grid item>
                            <Card
                                sx={{
                                    height: "490px",
                                    bgcolor: "primary.dark",
                                    p: 2,
                                    color: "#ffffff",
                                }}
                            >
                                <Stack
                                    alignItems="flex-start"
                                    sx={{ height: "100%" }}
                                >
                                    <img
                                        className="home-img-card"
                                        src="/articles.jpeg"
                                    />
                                    <Typography variant="h5" sx={{ my: 1 }}>
                                        Read our articles
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ width: "300px", flexGrow: 1 }}
                                    >
                                        Our selected doctors posts weekly
                                        articles related about the musicians
                                        health. Prevention and treatments can be
                                        found here.
                                    </Typography>
                                    <Button
                                        href="/articles"
                                        disableElevation
                                        color="secondary"
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                    >
                                        Find articles
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    height: "490px",
                                    bgcolor: "primary.dark",
                                    p: 2,
                                    color: "#ffffff",
                                }}
                            >
                                <Stack
                                    alignItems="flex-start"
                                    sx={{ height: "100%" }}
                                >
                                    <img
                                        className="home-img-card"
                                        src="/good_doctor.jpeg"
                                    />
                                    <Typography variant="h5" sx={{ my: 1 }}>
                                        Find a good doctor
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ width: "300px", flexGrow: 1 }}
                                    >
                                        Do you want to talk to a doctor from and
                                        existing issue or just prevention? Let's
                                        find together.
                                    </Typography>
                                    <Button
                                        href="/doctors"
                                        disableElevation
                                        color="secondary"
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                    >
                                        Find a doctor
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card
                                sx={{
                                    height: "490px",
                                    bgcolor: "primary.dark",
                                    p: 2,
                                    color: "#ffffff",
                                }}
                            >
                                <Stack
                                    alignItems="flex-start"
                                    sx={{ height: "100%" }}
                                >
                                    <img
                                        className="home-img-card"
                                        src="/insurance.png"
                                    />
                                    <Typography variant="h5" sx={{ my: 1 }}>
                                        Get insured
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ width: "300px", flexGrow: 1 }}
                                    >
                                        Your body is your instrument. You can
                                        get a insurence for any kind of problems
                                        that you may develop and afect your
                                        career.
                                    </Typography>
                                    <Button
                                        disableElevation
                                        color="secondary"
                                        variant="contained"
                                        sx={{ mt: 1 }}
                                    >
                                        Find a insurence
                                    </Button>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
