import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Avatar,
    Divider,
    Grid,
    IconButton,
    Tooltip,
    Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAuth } from "../context/AuthContext";

const MyAccountPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const currentUserId = localStorage.getItem("userId");
    const navigate = useNavigate();

    const { logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchMyRecipes = async () => {
            const res = await fetch("http://localhost:3001/api/my-recipes", {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    logout();
                }
                navigate("/");
            }
            const data = await res.json();
            setRecipes(data);
        };

        const fetchFavorites = async () => {
            const res = await fetch(`http://localhost:3001/api/favorites/user/${currentUserId}`, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    logout();
                }
                navigate("/");
            }
            const data = await res.json();
            setFavorites(data);
        };

        const fetchUserInfo = async () => {
            const res = await fetch(`http://localhost:3001/api/users/${currentUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    logout();
                }
                navigate("/");
            }
            const data = await res.json();
            setUserInfo(data);
        };

        const fetchAll = async () => {
            try {
                // TODO: Make it Promise.All()
                await fetchUserInfo();
                await fetchMyRecipes();
                await fetchFavorites();
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, [currentUserId, logout, navigate]);

    const handleDelete = async (id) => {
        if (!window.confirm("בטוח שברצונך למחוק את המתכון?")) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://localhost:3001/api/recipes/${id}/deactivate`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error("שגיאה במחיקה");

            setRecipes((prev) => prev.filter((recipe) => recipe.id !== id));
        } catch (err) {
            alert("שגיאה במחיקה: " + err.message);
        }
    };

    if (loading) return <p>טוען נתונים...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <Paper
            elevation={3}
            sx={{
                maxWidth: "100%",
                width: 1440,
                m: "0 auto", p: 4,
                borderRadius: 4,
                bgcolor: "#fff",
            }}
        >
            {/* פרטי משתמש */}
            <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar
                    src={userInfo?.avatar ? `/Avatars/${userInfo.avatar}` : undefined}
                    alt={userInfo?.username || "User"}
                    sx={{ width: 56, height: 56, fontWeight: "bold", bgcolor: userInfo?.avatar ? "transparent" : "primary.main" }}
                >
                    {!userInfo?.avatar && (userInfo?.username?.[0]?.toUpperCase() || "?")}
                </Avatar>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {userInfo?.username}
                    </Typography>
                    <Typography color="text.secondary">{userInfo?.email}</Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* המתכונים שלי */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    My Recipes
                </Typography>
                {recipes.length === 0 ? (
                    <Typography color="text.secondary">You haven&apos;t created any recipes yet.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {recipes.map((recipe) => (
                            <Grid item size={{ xs: 12, md: 6, lg: 3 }} key={recipe.id}>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: "#f9fafb",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "box-shadow 0.15s",
                                        "&:hover": { boxShadow: 6, bgcolor: "#f4f8fc" }
                                    }}
                                    onClick={() => navigate(`/recipe/${recipe.id}`)}
                                >
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            {recipe.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "normal",
                                            }}>
                                            {recipe.description}
                                        </Typography>
                                    </Box>
                                    {/* אייקונים עריכה ומחיקה — קליקים נפרדים */}
                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                color="primary"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/edit/${recipe.id}`);
                                                }}
                                                aria-label="edit"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(recipe.id);
                                                }}
                                                aria-label="delete"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* מועדפים שלי */}
            <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    My Favorites
                </Typography>
                {favorites.length === 0 ? (
                    <Typography color="text.secondary">You have no saved recipes.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {favorites.map((fav) => (
                            <Grid item size={{ xs: 12, md: 6 }} key={fav.recipe_id}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: "#f8f8ff",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        cursor: "pointer",
                                        position: "relative",
                                        transition: "box-shadow 0.15s",
                                        "&:hover": { boxShadow: 6, bgcolor: "#f5f9ff" }
                                    }}
                                    onClick={() => navigate(`/recipe/${fav.recipe_id}`)}
                                >
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            {fav.title}
                                            <FavoriteIcon color="error" sx={{ ml: 1, verticalAlign: "middle" }} />
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {fav.description}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Box>
        </Paper>
    );
};

export default MyAccountPage;
