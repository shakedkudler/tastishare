import React, { useState } from "react";
import { Paper, Box, Typography, TextField, Button, Alert } from "@mui/material";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3001/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Something went wrong");
            } else {
                setMessage("If this email exists, you will receive a reset link shortly.");
            }
        } catch {
            setError("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 400, mx: "auto", mt: 8, p: 4, borderRadius: 2 }}>
            <Typography variant="h5" mb={2} textAlign="center">
                Forgot Password
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                    margin="normal"
                />
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
                <Button type="submit" variant="contained" fullWidth disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                </Button>
            </Box>
        </Paper>
    );
};

export default ForgotPasswordPage;
