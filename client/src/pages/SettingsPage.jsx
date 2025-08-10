import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Divider,
    Stack,
    Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../context/AuthContext";

const availableAvatars = [
    "Avatar1.png",
    "Avatar2.png",
    "Avatar3.png",
    "Avatar4.png",
    "Avatar5.png",
    "Avatar6.png",
    "Avatar7.png",
    "Avatar8.png",
    "Avatar9.png",
    "Avatar10.png",
];

const SettingsPage = () => {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState("");
    const [msg, setMsg] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setSelectedAvatar(user.avatar || "");
        }
    }, [user]);

    const userId = user?.id;
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error("Failed to fetch user data");
            const data = await res.json();
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
            setUsername(data.username);
            setSelectedAvatar(data.avatar);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUsernameSave = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ username, avatar: selectedAvatar }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMsg(data.message || "Failed to update username.");
                return;
            }
            setMsg("Username updated successfully!");
            await fetchUserData();
        } catch (error) {
            setMsg("Server error: " + error.message);
        }
        setTimeout(() => setMsg(""), 3000);
    };

    const handleAvatarSave = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ avatar: selectedAvatar, username }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMsg(data.message || "Failed to update avatar.");
                return;
            }
            setMsg("Avatar updated successfully!");
            await fetchUserData();
        } catch (error) {
            setMsg("Server error: " + error.message);
        }
        setTimeout(() => setMsg(""), 3000);
    };

    const handleAvatarSelect = (avatar) => {
        setSelectedAvatar(avatar);
    };

    // מחיקת החשבון (רכה)
    const handleDeleteAccount = async () => {
        setDeleteError("");
        try {
            const res = await fetch(`http://localhost:3001/api/users/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // בדיקה אם התשובה היא JSON
            const contentType = res.headers.get("content-type");
            let data = {};
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            } else {
                const text = await res.text();
                throw new Error(`Server error: ${text}`);
            }

            if (!res.ok) {
                setDeleteError(data.message || "Account deletion failed");
                return;
            }
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            window.location.href = "/";
        } catch (err) {
            setDeleteError(err.message);
        }
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 1440, m: "0 auto", p: 4, borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" align="center" mb={3}>
                Settings
            </Typography>

            {msg && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    {msg}
                </Alert>
            )}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} mb={2}>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Button variant="contained" color="primary" onClick={handleUsernameSave}>
                    Save Username
                </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={1}>
                Profile Icon
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                <Avatar
                    src={`/Avatars/${selectedAvatar}`}
                    alt="avatar"
                    sx={{ width: 64, height: 64, border: "2px solid #e0e0e0" }}
                />
                <Button variant="contained" color="primary" onClick={handleAvatarSave}>
                    Save Avatar
                </Button>
            </Stack>

            <Typography variant="subtitle1" mb={1}>
                Choose your avatar:
            </Typography>
            <Stack direction="row" gap={2} flexWrap="wrap" mb={3}>
                {availableAvatars.map((avatar) => (
                    <Avatar
                        key={avatar}
                        src={`/Avatars/${avatar}`}
                        alt={avatar}
                        sx={{
                            width: 48,
                            height: 48,
                            border:
                                selectedAvatar === avatar
                                    ? "3px solid #1976d2"
                                    : "2px solid #e0e0e0",
                            cursor: "pointer",
                            transition: "border-color 0.3s",
                        }}
                        onClick={() => handleAvatarSelect(avatar)}
                    />
                ))}
            </Stack>

            {/* עיצוב Danger Zone למחיקת חשבון */}
            <Divider sx={{ my: 4 }} />

            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: 3,
                    bgcolor: "#fff4f4",
                    boxShadow: 1,
                    maxWidth: 480,
                    mx: "auto",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="h6"
                    color="error"
                    fontWeight="bold"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                    <DeleteIcon sx={{ mr: 1 }} />
                    Danger Zone
                </Typography>
                <Typography color="error" sx={{ mb: 2 }}>
                    Delete your account permanently.<br />
                    This action cannot be undone!
                </Typography>

                {deleteError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {deleteError}
                    </Alert>
                )}

                {!deleteConfirm ? (
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        sx={{
                            fontWeight: "bold",
                            borderWidth: 2,
                            px: 3,
                            py: 1,
                            transition: "box-shadow 0.2s",
                            boxShadow: 0,
                            "&:hover": { boxShadow: 2, borderWidth: 2 },
                        }}
                        onClick={() => setDeleteConfirm(true)}
                    >
                        Delete Account
                    </Button>
                ) : (
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{
                                fontWeight: "bold",
                                px: 3,
                                py: 1,
                                letterSpacing: 1,
                            }}
                            onClick={handleDeleteAccount}
                        >
                            Confirm Delete
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            sx={{ px: 3, py: 1 }}
                            onClick={() => setDeleteConfirm(false)}
                        >
                            Cancel
                        </Button>
                    </Stack>
                )}
            </Box>
        </Paper>
    );
};

export default SettingsPage;
