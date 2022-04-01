import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { Stack, Typography, Box, Button } from "@mui/material";

const SingleArticle = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState({});

    useEffect(() => {
        (async () => {
            const resp = await fetch(`/single-article/${articleId}.json`);
            const articleInfo = await resp.json();
            let wholeDate = new Date(articleInfo.timestamp).toDateString();
            const date = `${wholeDate
                .split(" ")
                .splice(2, 1)
                .join("")} ${wholeDate
                .split(" ")
                .splice(1, 1)
                .join("")} ${wholeDate.split(" ").splice(3, 1).join("")}`;
            articleInfo.timestamp = date;
            setArticle(articleInfo);
        })();
    }, []);

    return (
        <Stack sx={{ px: 24, minHeight: "83.5vh", color: "#818181" }}>
            <Typography
                variant="h3"
                component="h1"
                sx={{ color: "primary.dark", lineHeight: 1, mt: 2 }}
            >
                {article.title}
            </Typography>
            <Typography
                variant="body2"
                sx={{
                    fontStyle: "italic",
                    lineHeight: 1,
                    mt: 1,
                    mb: 3,
                }}
            >
                Article from {article.timestamp}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <img
                    className="small-round-profile-pic"
                    src={article.doctorPic || "/default-picture.png"}
                />
                <Box sx={{ color: "primary.dark" }}>
                    <Typography sx={{ fontWeight: "medium" }}>
                        Dr. {article.first} {article.last}
                    </Typography>
                    <Typography sx={{ fontWeight: "light" }}>
                        Specialist in {article.specialties}
                    </Typography>
                    <Typography sx={{ fontWeight: "light" }}>
                        {article.cityAndCountry}
                    </Typography>
                </Box>
            </Stack>
            <img
                className="big-article-pic"
                src={article.articlePic || "/default-img.png"}
            />
            <Typography sx={{ fontWeight: "medium", mt: 1, mb: 3 }}>
                {article.subtitle}
            </Typography>
            <Typography sx={{ mb: 4 }}>
                <div
                    className="article-text-container"
                    dangerouslySetInnerHTML={{ __html: article.text }}
                />
            </Typography>

            <Typography variant="h5" sx={{ color: "primary.dark" }}>
                Do you want to know more about this doctor?
            </Typography>
            <Box sx={{ mb: 4, mt: 2 }}>
                <Button
                    href={`/doctor/${article.doctorId}`}
                    sx={{ boxShadow: 3 }}
                    variant="contained"
                    color="secondary"
                >
                    Visit the doctor's profile
                </Button>
            </Box>
        </Stack>
    );
};

export default SingleArticle;
