import React, { useState } from "react";
import { useNavigate, Link as RouterLink, Route } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import Link from "@mui/material/Link";
import { useDialog } from "../context/DialogContext";

const AVATAR_COUNT = 10; // עדכני אם יהיו יותר/פחות

const RegisterPage = () => {
    const [form, setForm] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();

    const { openDialog } = useDialog();

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (form.password !== form.confirmPassword) {
            return setErrorMsg("Passwords do not match");
        }

        // בחרי אווטאר רנדומלי
        const randomAvatar = `Avatar${Math.floor(Math.random() * AVATAR_COUNT) + 1}.png`;

        try {
            const res = await fetch("http://localhost:3001/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    avatar: randomAvatar, // הוספת האווטאר לשליחה לשרת
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                return setErrorMsg(data.message || "Registration error");
            }

            openDialog({
                body: <Typography>You have successfully registered!</Typography>,
            });
            navigate("/login");
        } catch {
            setErrorMsg("ERROR");
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 2,
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    maxWidth: 768,
                    width: "100%",
                    p: 4,
                    borderRadius: 4,
                }}
            >
                <Typography
                    variant="body1"
                    component={RouterLink}
                    color="primary"
                    sx={{
                        display: "block",
                        mb: 3,
                        textAlign: "center",
                        fontSize: { xs: 20, sm: 24 },
                        fontWeight: 700,
                        textDecoration: "none",
                        cursor: "pointer",
                        "&:hover": { textDecoration: "none" }
                    }}
                    to="/"
                >
                    TastiShare
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography component="h1" variant="h1" fontWeight="bold" sx={{ mb: 1 }}>
                        Registration
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Create your account
                    </Typography>

                    <Box component="form" onSubmit={handleRegister} sx={{ mt: 1, width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="username"
                            label="Username"
                            value={form.username}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            label="Email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            size="small"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockOutlinedIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            edge="end"
                                            size="small"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errorMsg && <Alert severity="error" sx={{ mt: 1 }}>{errorMsg}</Alert>}

                        <Button
                            type="submit"
                            fullWidth
                            variant="outlined"
                            sx={{ my: 2, fontWeight: "bold" }}
                        >
                            Sign up
                        </Button>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Link component={RouterLink} to="/login" variant="body2" underline="hover" sx={{ fontSize: 14 }}>
                                Already have an account? Log in
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default RegisterPage;
