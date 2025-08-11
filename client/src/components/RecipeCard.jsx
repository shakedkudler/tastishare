import { Link } from "react-router-dom";
import {
    Paper,
    Typography,
    Box,
    Stack,
    Chip
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RecipeCard = ({ recipe }) => {
    const categoriesToShow = recipe.categories?.slice(0, 3) || [];
    const hasMoreCategories = (recipe.categories?.length || 0) > 3;

    console.log(recipe)

    return (
        <Paper
            elevation={2}
            sx={{
                p: 2,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 1,
                cursor: "pointer",
                "&:hover": { boxShadow: 6 },
            }}
            component={Link}
            to={`/recipe/${recipe.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
        >
            <Typography
                variant="h3"
                fontWeight="bold"
            >
                {recipe.title}
            </Typography>
            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                }}
            >
                {recipe.description}
            </Typography>
            <Stack direction="column" spacing={0.5} sx={{ mb: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    <AccessTimeIcon fontSize="small" color="action" />
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        fontWeight="normal"
                    >
                        {recipe.total_time || "-"} min
                    </Typography>
                </Stack>
            </Stack>
            {categoriesToShow.length > 0 && (
                <Stack
                    direction="row"
                    sx={{ mb: 1, flexWrap: "wrap", gap: 0.5 }}
                >
                    {categoriesToShow.map((cat) => (
                        <Chip
                            key={cat.id}
                            label={cat.name}
                            size="small"
                            color="primary"
                        />
                    ))}
                    {hasMoreCategories && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ alignSelf: "center", ml: 1 }}
                        >
                            ...
                        </Typography>
                    )}
                </Stack>
            )}
            {recipe.image ? (
                <Box
                    component="img"
                    src={`http://localhost:3001/uploads/${recipe.image}`}
                    alt={recipe.title}
                    sx={{
                        width: "100%",
                        borderRadius: 2,
                        objectFit: "cover",
                        minHeight: { xs: 70, sm: 80, md: 100 },
                        maxHeight: { xs: 90, sm: 110, md: 120 },
                        backgroundColor: "#f5f6fa",
                        display: "block",
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: "100%",
                        minHeight: { xs: 70, sm: 80, md: 120 },
                        maxHeight: { xs: 90, sm: 110, md: 120 },
                        display: "block",
                    }}
                />
            )}
            <Typography
                variant="body2"
                color="primary"
                fontWeight="bold"
                sx={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                }}
            >
                @{recipe.author}
            </Typography>
        </Paper>
    )
};

export default RecipeCard;
