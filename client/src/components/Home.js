import { Box, Typography, Grid, Card, Button, Stack } from "@mui/material";

const Home = () => {
    return (
        <>
            <Box sx={{ width: "100%", height: "200px", border: "1px solid" }}>
                Banner
            </Box>
            <Box sx={{ px: 6 }}>
                <Box
                    sx={{ width: "100%", height: "150px", border: "1px solid" }}
                >
                    Icons
                </Box>
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
                                        src="/default-img.png"
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
                                        src="/default-img.png"
                                    />
                                    <Typography variant="h5" sx={{ my: 1 }}>
                                        Find a doctor
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
                                        src="/default-img.png"
                                    />
                                    <Typography variant="h5" sx={{ my: 1 }}>
                                        Get insured
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ width: "300px", flexGrow: 1 }}
                                    >
                                        Your body is your instrument. You can ge
                                        a insurence for any kind of problems
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
        </>
    );
};

export default Home;
