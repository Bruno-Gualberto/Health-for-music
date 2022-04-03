import { Card, Grid, Typography, Button } from "@mui/material";

const DoctorsList = ({ doctor }) => {
    return (
        <Card elevation={3} sx={{ mb: 2, p: 2 }}>
            <Grid container columnSpacing={2}>
                <Grid item>
                    <img
                        className="articleList-img-card"
                        src={doctor.profilePic || "/default-picture.png"}
                    />
                </Grid>
                <Grid item xs container>
                    <Grid item xs={10}>
                        <Typography variant="h5" sx={{ color: "primary.dark" }}>
                            Dr. {doctor.first} {doctor.last}
                        </Typography>
                        <Typography sx={{ color: "#818181" }}>
                            {doctor.bio}
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
                            Specialist in {doctor.specialties}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#818181" }}>
                            {doctor.cityAndCountry}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        container
                        alignItems="flex-end"
                        justifyContent="flex-end"
                    >
                        <Button
                            color="secondary"
                            href={`/doctor/${doctor.id}`}
                            variant="contained"
                            disableElevation
                        >
                            See doctor
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    );
};

export default DoctorsList;
