import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
import Link from "@mui/material/Link";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const res = await fetch("http://localhost:3001/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                return setErrorMsg(data.message || "שגיאה בהתחברות");
            }

            if (!data.token || !data.user || !data.user.id) {
                setErrorMsg("Server error: Incorrect login information");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);

            login(data.user, data.token);

            navigate("/");
        } catch (err) {
            console.error(err);
            setErrorMsg("Server error");
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                // רקע קצת רך, אפשר לשנות או להסיר
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
                {/* כותרת לחיצה לעמוד הבית, מיושרת למרכז */}
                <Typography
                    variant="h4"
                    sx={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        mb: 3,
                        userSelect: "none",
                        textAlign: "center",
                    }}
                    color="primary"
                    onClick={() => navigate("/")}
                >
                    TastiShare
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography component="h1" variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                        Log In
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Please enter your Email and Password
                    </Typography>

                    <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: "100%" }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={showPassword ? "הסתר סיסמה" : "הצג סיסמה"}
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

                        {/* Forgot password link מימין */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                            <Link href="/forgot-password" variant="body2" underline="hover" sx={{ fontSize: 14 }}>
                                Forgot password?
                            </Link>
                        </Box>

                        {/* כפתור התחברות */}
                        <Button type="submit" fullWidth variant="outlined" sx={{ mb: 1, fontWeight: "bold" }}>
                            LOG IN
                        </Button>

                        {/* Sign up לינק באמצע */}
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Link href="/register" variant="body2" underline="hover" sx={{ fontSize: 14 }}>
                                Sign up
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
