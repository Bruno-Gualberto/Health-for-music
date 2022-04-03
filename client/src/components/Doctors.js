import { useState, useEffect } from "react";

import DoctorsList from "./DoctorsList";

import {
    Stack,
    Grid,
    Typography,
    Card,
    Button,
    TextField,
    MenuItem,
} from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [moreButton, setMoreButton] = useState(true);
    const [location, setLocation] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [name, setName] = useState("");

    const filterByLocation = (doctor, location) =>
        doctor.cityAndCountry.toLowerCase().includes(location.toLowerCase());

    const filterBySpecialty = (doctor, specialty) =>
        doctor.specialties.toLowerCase().includes(specialty.toLowerCase());

    const filterByName = ({ first, last }, name) =>
        first.toLowerCase().includes(name.toLowerCase()) ||
        last.toLowerCase().includes(name.toLowerCase());

    const handleSearch = () => {
        let result = [...doctors];
        if (location && specialty && name) {
            result = result.filter((doctor) => {
                return (
                    filterByLocation(doctor, location) &&
                    filterBySpecialty(doctor, specialty) &&
                    filterByName(doctor, name)
                );
            });
        } else if (location && specialty) {
            result = result.filter((doctor) => {
                return (
                    filterByLocation(doctor, location) &&
                    filterBySpecialty(doctor, specialty)
                );
            });
        } else if (location && name) {
            result = result.filter((doctor) => {
                return (
                    filterByLocation(doctor, location) &&
                    filterByName(doctor, name)
                );
            });
        } else if (name && specialty) {
            result = result.filter((doctor) => {
                return (
                    filterByName(doctor, name) &&
                    filterBySpecialty(doctor, specialty)
                );
            });
        } else if (location) {
            result = result.filter((doctor) =>
                filterByLocation(doctor, location)
            );
        } else if (specialty) {
            result = result.filter((doctor) =>
                filterBySpecialty(doctor, specialty)
            );
        } else if (name) {
            result = result.filter((doctor) => filterByName(doctor, name));
        }
        setDoctors(result);
    };

    useEffect(() => {
        (async () => {
            const resp = await fetch("/all-doctors.json");
            const allDoctors = await resp.json();
            setDoctors(allDoctors);
            allDoctors.filter((doctor) => doctor.id === doctor.lowestId).length
                ? setMoreButton(false)
                : setMoreButton(true);
        })();
    }, []);

    const handleClick = async () => {
        const smallestId = doctors[doctors.length - 1].id;
        const data = await fetch(`/more-doctors/${smallestId}.json`);
        const moreDoctors = await data.json();
        setDoctors([...doctors, ...moreDoctors]);
        moreDoctors.filter((doctor) => doctor.id === doctor.lowestId).length
            ? setMoreButton(false)
            : setMoreButton(true);
    };

    return (
        <Stack sx={{ px: 24, mb: 4 }}>
            <Typography variant="h3" sx={{ color: "primary.dark", mt: 2 }}>
                Doctors
            </Typography>
            <Typography variant="body1" sx={{ color: "primary.dark" }}>
                Find a doctor who is close to you and according to his area of
                expertise
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
                            placeholder="Type here the doctor's name"
                            value={name}
                            onChange={({ target }) => setName(target.value)}
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
                            Find doctors
                        </Button>
                    </Grid>
                    <Grid item>
                        <TextField
                            className="select"
                            size="small"
                            label="Select specialty"
                            select
                            value={specialty}
                            onChange={({ target }) =>
                                setSpecialty(target.value)
                            }
                            sx={{
                                minWidth: "200px",
                                mr: 1,
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Mental health">
                                Mental health
                            </MenuItem>
                            <MenuItem value="Hand">Hand</MenuItem>
                            <MenuItem value="Ears">Ears</MenuItem>
                            <MenuItem value="Musicians health">
                                Musicians health
                            </MenuItem>
                        </TextField>
                        <TextField
                            className="select"
                            size="small"
                            label="Select location"
                            select
                            value={location}
                            onChange={({ target }) => setLocation(target.value)}
                            sx={{ minWidth: "200px" }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Berlin, Germany">
                                Berlin, Germany
                            </MenuItem>
                            <MenuItem value="New York, USA">
                                New York, USA
                            </MenuItem>
                            <MenuItem value="Hobbiton Village, New Zealand">
                                Hobbiton Village, New Zealand
                            </MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Card>
            {doctors &&
                doctors.map((doctor) => (
                    <DoctorsList key={doctor.id} doctor={doctor} />
                ))}

            {moreButton && (
                <Button
                    endIcon={<KeyboardArrowDown />}
                    variant="outlined"
                    color="info"
                    sx={{ alignSelf: "center", mt: 2 }}
                    onClick={handleClick}
                >
                    More doctors
                </Button>
            )}
        </Stack>
    );
};

export default Doctors;
