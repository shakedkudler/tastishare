import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    Button,
    Divider,
    CircularProgress,
} from "@mui/material";
import EmblaCarousel from "../components/EmblaCarousel"; // עדכני את הנתיב לפי הצורך

const HomePage = () => {
    const [carousel1Recipes, setCarousel1Recipes] = useState([]);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [newRecipes, setNewRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchRecipes() {
            setLoading(true);
            try {
                // קרוסלה 1 - רנדומלי 6 מתכונים
                const res1 = await fetch("http://localhost:3001/api/recipes/random/6");
                const data1 = await res1.json();

                // קרוסלה 2 - פופולריים - מעל 4 כוכבים ועם תמונה, 6 מתכונים
                const res2 = await fetch("http://localhost:3001/api/recipes");
                const allRecipes = await res2.json();
                const popular = allRecipes
                    .filter((r) => {
                        const passes = r.averageRating > 4 && r.image && r.image.trim() !== "";
                        if (!passes) {
                            console.log("Filtered out recipe:", r.title, "avg rating:", r.averageRating, "image:", r.image);
                        }
                        return passes;
                    })
                    .slice(0, 6);

                console.log("Popular recipes:", popular);

                // קרוסלה 3 - חדשים - 6 מתכונים אחרונים לפי created_at
                const neweset = allRecipes
                    .filter((r) => r.image && r.image.trim() !== "")
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 6);

                setCarousel1Recipes(data1);
                setPopularRecipes(popular);
                setNewRecipes(neweset);
            } catch (error) {
                console.error("Error loading recipes:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecipes();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

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
            <Typography
                variant="h1"
                fontWeight="bold"
                align="center"
                color="primary.main"
                sx={{ mb: 3, mt: 2 }}
            >
                Welcome to TastiShare!
            </Typography>

            <Typography
                align="center"
                sx={{ mb: 4, color: "text.secondary", fontSize: 20 }}
            >
                Discover delicious recipes, share your creations, and find inspiration!
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* קרוסלה ראשונה */}
            <Box sx={{ mb: 1 }}>
                <EmblaCarousel
                    recipes={carousel1Recipes}
                    options={{ loop: true, align: "center", slidesToScroll: 1 }}
                />
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/recipes")}
                        sx={{
                            px: 5,
                            fontWeight: "bold",
                            borderRadius: 3,
                            letterSpacing: 1,
                            fontSize: 20,
                        }}
                    >
                        All Recipes
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* קרוסלה פופולרית */}
            <Box sx={{ mb: 1, textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }} color="primary.main">
                    Popular Recipes
                </Typography>
                <EmblaCarousel
                    recipes={popularRecipes}
                    options={{ loop: true, align: "center", slidesToScroll: 1 }}
                />
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/recipes?filter=popular")}  // כאן מעבירים פרמטר filter=popular
                        sx={{
                            px: 5,
                            fontWeight: "bold",
                            borderRadius: 3,
                            letterSpacing: 1,
                            fontSize: 20,
                        }}
                    >
                        All Popular
                    </Button>
                </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* קרוסלה של מתכונים חדשים */}
            <Box sx={{ mb: 1, textAlign: "center" }}>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }} color="primary.main">
                    New Recipes
                </Typography>
                <EmblaCarousel
                    recipes={newRecipes}
                    options={{ loop: true, align: "center", slidesToScroll: 1 }}
                />
                <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate("/recipes?filter=new")}  // כאן מעבירים פרמטר filter=new
                        sx={{
                            px: 5,
                            fontWeight: "bold",
                            borderRadius: 3,
                            letterSpacing: 1,
                            fontSize: 20,
                        }}
                    >
                        All New
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};

export default HomePage;
