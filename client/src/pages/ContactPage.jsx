import React, { useState } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import SubjectIcon from "@mui/icons-material/Subject";
import MessageIcon from "@mui/icons-material/Message";

const ContactPage = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setSuccess("");
        setError("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add real API call here if needed
        if (!form.name || !form.email || !form.message) {
            setError("Please fill in all required fields.");
            return;
        }
        setSuccess("Your message has been sent successfully! Thank you for reaching out.");
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (

        <Paper elevation={3}
            sx={{
                maxWidth: 1440,
                m: "0 auto",
                p: 4,
                borderRadius: 4,
            }}>
            <Box sx={{ textAlign: "center", mb: 2 }}>
                <EmailIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
                    Contact Us
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Feel free to reach out for any questions or feedback!
                </Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="name"
                    label="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <PersonIcon sx={{ mr: 1 }} fontSize="small" />,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    type="email"
                    name="email"
                    label="Email"
                    value={form.email}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <EmailIcon sx={{ mr: 1 }} fontSize="small" />,
                    }}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    name="subject"
                    label="Subject (optional)"
                    value={form.subject}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <SubjectIcon sx={{ mr: 1 }} fontSize="small" />,
                    }}
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    multiline
                    minRows={4}
                    name="message"
                    label="Message"
                    value={form.message}
                    onChange={handleChange}
                    InputProps={{
                        startAdornment: <MessageIcon sx={{ mr: 1 }} fontSize="small" />,
                    }}
                />
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {success}
                    </Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    color="primary"
                    sx={{ mt: 3, fontWeight: "bold" }}
                >
                    Send Message
                </Button>
            </form>
        </Paper>
    );
};

export default ContactPage;
