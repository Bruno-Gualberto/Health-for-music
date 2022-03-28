import { useState } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Header from "./Header";
import {
    Box,
    FormControl,
    FormLabel,
    FormControlLabel,
    RadioGroup,
    Radio,
    Button,
} from "@mui/material";

const Welcome = () => {
    const [doctor, setDoctor] = useState("");
    const handleChange = ({ target }) => {
        setDoctor(target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (doctor === "true") {
            const resp = await fetch("/add-doctor.json", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ doctor: true }),
            });
            const data = await resp.json();
            console.log("doctor data: ", data);
            // put data into redux
            location.assign("/");
        } else {
            const resp = await fetch("/add-user.json", {
                method: "POST",
                headers: { "Content-Type": "application/json " },
                body: JSON.stringify({ doctor: false }),
            });
            const data = await resp.json();
            console.log("user data: ", data);
            // put data into redux
            location.assign("/");
        }
    };

    return (
        <div className="welcome-container">
            {/* <Header loggedIn={false} /> */}
            Welcome to Health for music!
            <Box>
                <FormControl>
                    <FormLabel id="doctor-or-musician-label">
                        Are you a doctor or a musician?
                    </FormLabel>
                    <RadioGroup
                        name="doctor-or-musician"
                        aria-labelledby="doctor-or-musician-label"
                        value={doctor}
                        onChange={handleChange}
                    >
                        <FormControlLabel
                            control={<Radio />}
                            label="Doctor"
                            value={true}
                        />
                        <FormControlLabel
                            control={<Radio />}
                            label="Musician"
                            value={false}
                        />
                    </RadioGroup>
                    <Button variant="contained" onClick={handleSubmit}>
                        Submit
                    </Button>
                </FormControl>
            </Box>
        </div>
    );
};

export default Welcome;
