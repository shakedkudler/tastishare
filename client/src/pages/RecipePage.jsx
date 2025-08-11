import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Stack,
    Button,
    IconButton,
    Rating,
    Chip,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Collapse,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StarIcon from "@mui/icons-material/Star";
import RateReviewIcon from "@mui/icons-material/RateReview";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import { useAuth } from "../context/AuthContext";
import { useDialog } from "../context/DialogContext";

const RecipePage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [showReviewInput, setShowReviewInput] = useState(false);
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(false);

    const { logout } = useAuth();
    const { openDialog } = useDialog();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const res = await fetch(`http://localhost:3001/api/recipes/${id}/full`);
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) {
                        logout();
                    }
                    navigate("/");
                }
                const data = await res.json();
                setRecipe(data);
                setIsFavorite(data.isFavorite || false);
            } catch (err) {
                console.error("Error retrieving full recipe:", err);
            }
        };
        fetchRecipe();
    }, [id, logout, navigate]);

    useEffect(() => {
        const checkIfFavorite = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const res = await fetch(`http://localhost:3001/api/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                });
                const data = await res.json();
                setIsFavorite(data.isFavorite);
            } catch (err) {
                console.error("Failed to check favorite status", err);
            }
        };
        checkIfFavorite();
    }, [id]);

    // Check if user is recipe creator
    const isRecipeOwner = userId && recipe && String(recipe.userId) === String(userId);

    if (!recipe) return <p>Loading recipe...</p>;

    const formattedDate = new Date(recipe.created_at).toLocaleDateString("en-GB");

    // Calculate average rating
    const averageRating =
        recipe.reviews && recipe.reviews.length
            ? (
                recipe.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / recipe.reviews.length
            ).toFixed(1)
            : null;

    const handleReviewSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!newComment || !newRating) {
            openDialog({
                body: <Typography>Please provide both comment and rating</Typography>,
            });
            return;
        }

        try {
            const res = await fetch(`http://localhost:3001/api/reviews/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    comment: newComment,
                    rating: newRating,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to submit review");

            setRecipe((prev) => ({
                ...prev,
                reviews: [data.review, ...(prev.reviews || [])],
            }));

            setNewComment("");
            setNewRating(0);
            setShowReviewInput(false);
        } catch (err) {
            console.error("Error adding review:", err);
            openDialog({
                body: <Typography>Failed to submit review</Typography>,
            });
        }
    };

    const toggleFavorite = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const method = isFavorite ? "DELETE" : "POST";
            const url = `http://localhost:3001/api/favorites/${id}`;
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to toggle favorite");

            setIsFavorite(!isFavorite);
        } catch (err) {
            console.error(err);
            openDialog({
                body: <Typography>Failed to update favorite status</Typography>,
            });
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        openDialog({
            body: <Typography>Recipe link copied!</Typography>,
            //confirmText: "Confirm",
            //cancelText: "Cancel",
            //onConfirm: () => console.log("Confirmed"),
            //onCancel: () => console.log("Canceled")
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: 1440,
                maxWidth: "100%",
                m: "0 auto",
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                minHeight: 600,
            }}
        >
            {/* Back button */}
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate("/recipes")}
                sx={{ mb: 2 }}
            >
                Back to Recipes
            </Button>

            {/* Title + image + categories */}
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                {recipe.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {recipe.description}
            </Typography>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: "flex-start", mb: 2 }}>
                {recipe.image && (
                    <Box
                        component="img"
                        src={`http://localhost:3001/uploads/${recipe.image}`}
                        alt={recipe.title}
                        sx={{
                            width: { xs: "100%", sm: 350 },
                            maxWidth: 350,
                            maxHeight: 350,
                            height: "auto",
                            objectFit: "contain",
                            borderRadius: 2,
                            boxShadow: 1,
                            bgcolor: "#f8f8fa"
                        }}
                    />
                )}
                {/* Categories */}
                {recipe.categories && recipe.categories.length > 0 && (
                    <Stack
                        direction="column"
                        spacing={1}
                        sx={{ minWidth: 120, pt: 1, flexWrap: "wrap" }}
                    >
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {recipe.categories.map((cat) => (
                                <Chip key={cat.id || cat.category_id} label={cat.name} color="primary" />
                            ))}
                        </Stack>

                        {/* כאן נוספו הזמנים מתחת לקטגוריות עם אייקונים */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Preparation: {recipe.prep_time || "N/A"} min
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                            <LocalDiningIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Cooking: {recipe.cook_time || "N/A"} min
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 0.5 }}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Total: {recipe.total_time || "N/A"} min
                            </Typography>
                        </Stack>
                    </Stack>
                )}
            </Box>

            {/* Info */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ xs: "flex-start", md: "center" }} sx={{ mb: 2, flexWrap: "wrap" }}>
                {/* כאן שיניתי - מציגים את האווטאר אם יש */}
                {recipe.avatar ? (
                    <Avatar
                        src={`/Avatars/${recipe.avatar}`}
                        alt={recipe.username}
                        sx={{ width: 40, height: 40 }}
                    />
                ) : (
                    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                        {recipe.username?.[0]?.toUpperCase() || "?"}
                    </Avatar>
                )}
                <Typography><b>By:</b> {recipe.username}</Typography>
                <Typography color="text.secondary" sx={{ mx: 1 }}>
                    {formattedDate}
                </Typography>
            </Stack>

            {/* Action buttons */}
            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                {userId && !isRecipeOwner && (
                    <IconButton
                        color={isFavorite ? "error" : "primary"}
                        onClick={toggleFavorite}
                        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                    >
                        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                )}
                <IconButton color="primary" onClick={handleShare} aria-label="Share">
                    <ShareIcon />
                </IconButton>
                <IconButton color="primary" onClick={handlePrint} aria-label="Print">
                    <PrintIcon />
                </IconButton>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        <RestaurantMenuIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Ingredients
                    </Typography>
                    <List>
                        {recipe.ingredients.map((ingredient, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                    <StarIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${ingredient.name}${ingredient.quantity ? ` - ${ingredient.quantity}` : ""}`}
                                    sx={{ wordBreak: "break-word" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            {/* Steps */}
            {recipe.steps && recipe.steps.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                        <ListAltIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Steps
                    </Typography>
                    <List>
                        {recipe.steps.map((step, idx) => (
                            <ListItem key={idx} sx={{ py: 0.5 }}>
                                <ListItemIcon>
                                    <StarIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={step.description}
                                    sx={{ wordBreak: "break-word" }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Divider sx={{ my: 2 }} />

            {/* Add review button and input */}
            {userId && !isRecipeOwner && (
                <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }} className="review-button-paper">
                    <Button
                        startIcon={<RateReviewIcon />}
                        variant="outlined"
                        color="primary"
                        onClick={() => setShowReviewInput((prev) => !prev)}
                        sx={{ mb: 1, fontWeight: "bold" }}
                    >
                        {showReviewInput ? "Cancel Review" : "Add Your Review"}
                    </Button>
                    <Collapse in={showReviewInput}>
                        <Stack spacing={2} sx={{ mt: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography>Rating:</Typography>
                                <Rating
                                    name="new-rating"
                                    value={newRating}
                                    onChange={(_, newValue) => setNewRating(newValue)}
                                />
                            </Stack>
                            <TextField
                                multiline
                                minRows={3}
                                fullWidth
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What do you think about this recipe?"
                            />
                            <Button
                                onClick={handleReviewSubmit}
                                variant="contained"
                                color="primary"
                                sx={{ fontWeight: "bold" }}
                            >
                                Submit Review
                            </Button>
                        </Stack>
                    </Collapse>
                </Paper>
            )}

            {/* Reviews with average rating */}
            {recipe.reviews && recipe.reviews.length > 0 && (
                <Box className="reviews-section" sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Reviews
                        </Typography>
                        {averageRating && (
                            <>
                                <Rating value={Number(averageRating)} precision={0.1} readOnly size="small" sx={{ ml: 1 }} />
                                <Typography color="text.secondary" sx={{ fontWeight: "bold" }}>
                                    {averageRating}
                                </Typography>
                            </>
                        )}
                    </Stack>
                    {recipe.reviews.map((review, idx) => (
                        <Paper
                            key={idx}
                            elevation={0}
                            sx={{ mb: 2, p: 2, borderRadius: 2, border: "1px solid #eee", bgcolor: "#fcfcfc" }}
                        >
                            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} spacing={1} sx={{ mb: 0.5 }}>
                                {/* כאן גם מציגים את האווטאר בביקורת */}
                                {review.avatar ? (
                                    <Avatar
                                        src={`/Avatars/${review.avatar}`}
                                        alt={review.username}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ) : (
                                    <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main", fontSize: 18 }}>
                                        {review.username?.[0]?.toUpperCase() || "?"}
                                    </Avatar>
                                )}
                                <Typography fontWeight="bold">{review.username}</Typography>
                                <Rating value={review.rating} readOnly size="small" />
                                <Typography color="text.secondary" sx={{ ml: 1, fontSize: 13 }}>
                                    {new Date(review.created_at).toLocaleDateString("en-GB")}
                                </Typography>
                            </Stack>
                            <Typography sx={{ mt: 0.5 }}>{review.comment}</Typography>
                        </Paper>
                    ))}
                </Box>
            )}
        </Paper>
    );
};

export default RecipePage;
