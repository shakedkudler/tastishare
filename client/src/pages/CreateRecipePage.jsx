import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Chip,
    Divider,
    IconButton,
    Stack,
    Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalDiningIcon from "@mui/icons-material/LocalDining";

const CreateRecipePage = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [steps, setSteps] = useState([{ description: "" }]);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:3001/api/categories")
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch(() => { });
    }, []);

    // תצוגה מקדימה לקובץ תמונה
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        } else {
            setImagePreview(null);
        }
    };

    const handleAddIngredient = () => setIngredients([...ingredients, { name: "", quantity: "" }]);
    const handleRemoveIngredient = (idx) => {
        if (ingredients.length > 1) setIngredients(ingredients.filter((_, i) => i !== idx));
    };
    const handleAddStep = () => setSteps([...steps, { description: "" }]);
    const handleRemoveStep = (idx) => {
        if (steps.length > 1) setSteps(steps.filter((_, i) => i !== idx));
    };
    const handleCategoryToggle = (categoryId) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId]
        );
    };
    const handleReset = () => {
        setTitle("");
        setDescription("");
        setImage(null);
        setImagePreview(null);
        setIngredients([{ name: "", quantity: "" }]);
        setSteps([{ description: "" }]);
        setSelectedCategories([]);
        setPrepTime("");
        setCookTime("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (selectedCategories.length === 0) {
            return setError("Please select at least one category.");
        }

        if (!prepTime || !cookTime) {
            return setError("Please enter both preparation and cooking times.");
        }

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            if (image) formData.append("image", image);
            formData.append("ingredients", JSON.stringify(ingredients));
            formData.append("steps", JSON.stringify(steps));
            selectedCategories.forEach((catId) => formData.append("categories", catId));
            formData.append("prep_time", prepTime);
            formData.append("cook_time", cookTime);

            const res = await fetch("http://localhost:3001/api/recipes", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) return setError(data.message || "Error creating recipe");
            navigate("/account");
        } catch (err) {
            console.error(err)
            setError("Server error");
        }
    };

    return (
        <Paper elevation={3} sx={{ maxWidth: 1440, m: "0 auto", p: 4, borderRadius: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
                Create a New Recipe
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Recipe Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required fullWidth sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required fullWidth multiline rows={3} sx={{ mb: 2 }}
                />

                {/* תצוגת תמונה נבחרת */}
                {imagePreview && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Selected image:
                        </Typography>
                        <Box
                            sx={{
                                width: "100%", maxWidth: 420, aspectRatio: "16/9", overflow: "hidden", borderRadius: 2,
                                mx: "auto", boxShadow: 1, bgcolor: "#eee", display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <Box component="img" src={imagePreview} alt="preview"
                                sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                            />
                        </Box>
                        <Typography variant="caption" sx={{ display: "block", mt: 0.5 }}>
                            {image?.name}
                        </Typography>
                    </Box>
                )}

                <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
                    Upload Image
                    <input type="file" accept="image/*" hidden onChange={handleFileChange} />
                </Button>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Categories
                </Typography>
                <Stack direction="row" gap={0.5} sx={{ flexWrap: "wrap", mb: 2 }}>
                    {categories.length === 0 ? (
                        <Typography color="text.secondary">No categories available.</Typography>
                    ) : (
                        categories.map((cat) => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                color={selectedCategories.includes(cat.id) ? "primary" : "default"}
                                clickable
                                onClick={() => handleCategoryToggle(cat.id)}
                                sx={{ mb: 1 }}
                            />
                        ))
                    )}
                </Stack>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }} alignItems={{ xs: "flex-start", md: "center" }}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <TextField
                        label="Preparation Time (minutes)"
                        type="number"
                        value={prepTime}
                        onChange={e => setPrepTime(e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ min: 0 }}
                        required
                    />
                    <LocalDiningIcon fontSize="small" color="action" sx={{ ml: 3 }} />
                    <TextField
                        label="Cooking Time (minutes)"
                        type="number"
                        value={cookTime}
                        onChange={e => setCookTime(e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ min: 0 }}
                        required
                    />
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Ingredients
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {ingredients.map((ingredient, idx) => (
                        <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                label="Ingredient"
                                value={ingredient.name}
                                onChange={e => {
                                    const copy = [...ingredients];
                                    copy[idx].name = e.target.value;
                                    setIngredients(copy);
                                }}
                                required
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="Quantity"
                                value={ingredient.quantity}
                                onChange={e => {
                                    const copy = [...ingredients];
                                    copy[idx].quantity = e.target.value;
                                    setIngredients(copy);
                                }}
                                required
                                sx={{ flex: 1 }}
                            />
                            {ingredients.length > 1 && (
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveIngredient(idx)}
                                    aria-label="Remove ingredient"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Button
                        type="button"
                        onClick={handleAddIngredient}
                        variant="text"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Add Ingredient
                    </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" sx={{ mb: 1 }}>
                    Preparation Steps
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    {steps.map((step, idx) => (
                        <Box key={idx} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <TextField
                                label={`Step ${idx + 1}`}
                                value={step.description}
                                onChange={e => {
                                    const copy = [...steps];
                                    copy[idx].description = e.target.value;
                                    setSteps(copy);
                                }}
                                required
                                multiline
                                sx={{ flex: 1 }}
                            />
                            {steps.length > 1 && (
                                <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemoveStep(idx)}
                                    aria-label="Remove step"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Box>
                    ))}
                    <Button
                        type="button"
                        onClick={handleAddStep}
                        variant="text"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Add Step
                    </Button>
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary">
                        Create Recipe
                    </Button>
                    <Button type="button" variant="outlined" color="secondary" onClick={handleReset}>
                        Reset
                    </Button>
                </Stack>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            </form>
        </Paper >
    );
};

export default CreateRecipePage;
