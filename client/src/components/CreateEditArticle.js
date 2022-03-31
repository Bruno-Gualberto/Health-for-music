import { useState } from "react";
import { useHistory } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import {
    Stack,
    Typography,
    TextField,
    Button,
    Card,
    CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

const CreateEditArticle = () => {
    const modules = {
        toolbar: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
        ],
    };

    const formats = [
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "link",
    ];

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [text, setText] = useState("");
    const [articlePic, setArticlePic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const history = useHistory();

    const handleQuillChange = (value) => {
        setText(value);
    };

    const handleTitleChange = (target) => {
        setTitle(target.value);
    };

    const handleSubtitleChange = (target) => {
        setSubtitle(target.value);
    };

    const handleArticlePicChange = (e) => {
        setArticlePic(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const fd = new FormData();
        fd.append("title", title);
        fd.append("subtitle", subtitle);
        fd.append("text", text);
        fd.append("file", articlePic);

        const resp = await fetch("/add-new-article.json", {
            method: "POST",
            body: fd,
        });

        const data = await resp.json();

        if (data.error) {
            setError(data.error);
        } else {
            history.push(`/article/${data.articleId}`);
        }
    };

    // ver se tem algo nos params e caso nao tenha, create mode, caso tenha, edit mode
    return (
        <Stack
            sx={{ px: 24, mb: 4, minHeight: "83.5vh", color: "primary.dark" }}
        >
            <Typography variant="h3" sx={{ fontWeight: "light", my: 3 }}>
                Your <strong>article</strong>
            </Typography>
            <Card elevation={3} sx={{ p: 4, color: "primary.dark" }}>
                {error && (
                    <Typography sx={{ color: "error.main", my: 2 }}>
                        {error}
                    </Typography>
                )}
                <form>
                    <Typography>Title of your article</Typography>
                    <TextField
                        name="title"
                        type="text"
                        value={title}
                        onChange={({ target }) => handleTitleChange(target)}
                        fullWidth
                        size="small"
                        placeholder="Title"
                        inputProps={{ maxLength: 50 }}
                        helperText="Maximum characters allowed: 50"
                    />

                    <Typography sx={{ mt: 4 }}>
                        Subtitle of your article
                    </Typography>
                    <TextField
                        name="subtitle"
                        type="text"
                        fullWidth
                        value={subtitle}
                        onChange={({ target }) => handleSubtitleChange(target)}
                        multiline
                        rows={2}
                        size="small"
                        placeholder="Subtitle"
                        inputProps={{ maxLength: 255 }}
                        helperText="Maximum characters allowed: 255"
                    />

                    <Typography sx={{ mt: 4 }}>Text of your article</Typography>
                    <ReactQuill
                        theme="snow"
                        value={text}
                        modules={modules}
                        formats={formats}
                        onChange={handleQuillChange}
                        style={{
                            color: "black",
                            height: "300px",
                            marginBottom: "68px",
                        }}
                    />

                    <Typography sx={{ mb: 2 }}>
                        Upload image to the article
                    </Typography>
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            disableElevation
                            variant="contained"
                            color="secondary"
                            component="label"
                        >
                            {!articlePic ? (
                                "Upload"
                            ) : (
                                <div
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        maxWidth: "180px",
                                    }}
                                >
                                    <Typography
                                        noWrap
                                        sx={{
                                            fontSize: "0.875rem",
                                            fontWeight: 500,
                                        }}
                                    >
                                        {articlePic.name}
                                    </Typography>
                                </div>
                            )}
                            <input
                                type="file"
                                hidden
                                name="articlePic"
                                onChange={(e) => handleArticlePicChange(e)}
                            />
                        </Button>
                        {!loading ? (
                            <Button
                                disableElevation
                                variant="contained"
                                color="secondary"
                                onClick={(e) => handleSubmit(e)}
                            >
                                publish article
                            </Button>
                        ) : (
                            <CircularProgress color="secondary" />
                        )}
                    </Stack>
                </form>
            </Card>
        </Stack>
    );
};

export default CreateEditArticle;