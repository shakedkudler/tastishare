import { Link } from "react-router-dom";
import {
    Paper,
    Box,
    Typography,
    Stack,
    Chip
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const RecipeListItem = ({ recipe }) => {
    const categoriesToShow = recipe.categories?.slice(0, 3) || [];
    const hasMoreCategories = (recipe.categories?.length || 0) > 3;

    return (
        <Paper
            component={Link}
            to={`/recipe/${recipe.id}`}
            elevation={1}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: 3,
                textDecoration: "none",
                color: "inherit",
                "&:hover": { boxShadow: 3 },
                minHeight: 100,
            }}
        >
            {/* Image */}
            <Box
                component="img"
                src={
                    recipe.image
                        ? `http://localhost:3001/uploads/${recipe.image}`
                        : "https://via.placeholder.com/80x80?text=No+Image"
                }
                alt={recipe.title}
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    objectFit: "cover",
                    flexShrink: 0,
                    backgroundColor: "#f5f5f5",
                }}
            />
            <Box sx={{ flex: 1, overflow: "hidden" }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 0.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                    {recipe.title}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        mb: 0.5,
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                    }}
                >
                    {recipe.description}
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    flexWrap="wrap"
                    justifyContent="space-between"
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                        sx={{ display: { xs: "none", sm: "flex" } }}
                    >
                        {categoriesToShow.map((cat) => (
                            <Chip
                                key={cat.id}
                                label={cat.name}
                                size="small"
                                sx={{ fontSize: "0.7rem", height: 22 }}
                                color="primary"
                            />
                        ))}
                        {hasMoreCategories && (
                            <Chip label="..." size="small" sx={{ fontSize: "0.7rem", height: 22 }} />
                        )}
                    </Stack>
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={0.5}
                    >
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                                {recipe.total_time || "-"} min
                            </Typography>
                        </Stack>
                        {recipe.author && (
                            <>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: { xs: "none", sm: "inline" } }}
                                >
                                    •
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="primary"
                                    fontWeight="bold"
                                    sx={{
                                        overflow: "hidden",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: "vertical",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                        maxWidth: { xs: "100%", sm: "100px" },
                                    }}
                                >
                                    {recipe.author}
                                </Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
};

export default RecipeListItem;
