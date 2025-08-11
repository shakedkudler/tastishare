import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    Paper,
    Box,
    Typography,
    Grid,
    Skeleton,
    Stack,
    Chip,
    Button,
    Menu,
    MenuItem,
    Divider,
    Pagination,
    PaginationItem,
    IconButton,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import GridViewIcon from "@mui/icons-material/GridView";
import SearchBar from "./../components/SearchBar";
import { useAuth } from "../context/AuthContext";
import RecipeCard from "../components/RecipeCard";
import RecipeListItem from "../components/RecipeListItem";

const RECIPES_PER_PAGE = 12;

const RecipesPage = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortAnchor, setSortAnchor] = useState(null);
    const [filterAnchor, setFilterAnchor] = useState(null);
    const [sortBy, setSortBy] = useState("date-desc");
    const [page, setPage] = useState(1);
    const [isGridView, setIsGridView] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const filter = queryParams.get("filter");

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:3001/api/recipes`;

                if (filter === "popular") {
                    url = `http://localhost:3001/api/recipes/popular`;
                } else if (filter === "new") {
                    url = `http://localhost:3001/api/recipes/new`;
                }

                const res = await fetch(url);
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) logout();
                    navigate("/");
                }
                const data = await res.json();

                console.log("Fetched recipes:", data);

                setRecipes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, [filter, logout, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("http://localhost:3001/api/categories");
                if (!res.ok) {
                    if (res.status === 401 || res.status === 403) logout();
                    navigate("/");
                }
                const data = await res.json();
                setCategories(data);
            } catch {
                // Optional error handling
            }
        };
        fetchCategories();
    }, [logout, navigate]);

    const handleCategoryClick = (catId) => {
        setSelectedCategories((prev) =>
            prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
        );
    };
    const handleClearCategories = () => setSelectedCategories([]);

    const handleSortClick = (e) => setSortAnchor(e.currentTarget);
    const handleSortClose = () => setSortAnchor(null);
    const handleSortSelect = (sortOption) => {
        setSortBy(sortOption);
        setSortAnchor(null);
    };

    const handleFilterClick = (e) => setFilterAnchor(e.currentTarget);
    const handleFilterClose = () => setFilterAnchor(null);

    const filteredRecipes = recipes.filter((recipe) => {
        const matchesSearch = recipe.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        if (selectedCategories.length === 0) return matchesSearch;
        const recipeCategoryIds = (recipe.categories || []).map((cat) => cat.id);
        const matchesCategories = selectedCategories.every((catId) =>
            recipeCategoryIds.includes(catId)
        );
        return matchesSearch && matchesCategories;
    });

    const clientSortedRecipes = (() => {
        if (sortBy === "abc-asc")
            return [...filteredRecipes].sort((a, b) =>
                a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
            );
        if (sortBy === "abc-desc")
            return [...filteredRecipes].sort((a, b) =>
                b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
            );
        if (sortBy === "date-asc")
            return [...filteredRecipes].sort(
                (a, b) => new Date(a.created_at) - new Date(b.created_at)
            );
        if (sortBy === "date-desc")
            return [...filteredRecipes].sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        if (sortBy === "total-asc")
            return [...filteredRecipes].sort(
                (a, b) => Number(a.total_time) - Number(b.total_time)
            );
        if (sortBy === "total-desc")
            return [...filteredRecipes].sort(
                (a, b) => Number(b.total_time) - Number(a.total_time)
            );
        return filteredRecipes;
    })();

    const totalPages = Math.ceil(clientSortedRecipes.length / RECIPES_PER_PAGE);
    const paginatedRecipes = clientSortedRecipes.slice(
        (page - 1) * RECIPES_PER_PAGE,
        page * RECIPES_PER_PAGE
    );
    const handlePageChange = (e, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        setPage(1);
    }, [searchTerm, selectedCategories, sortBy]);

    return (
        <Paper
            elevation={3}
            sx={{
                width: 1440,
                maxWidth: "100%",
                m: "0 auto",
                p: { xs: 1, md: 4 },
                borderRadius: 4,
                minHeight: "80vh",
                bgcolor: "#fff",
            }}
        >
            <Typography
                variant="h1"
                fontWeight="bold"
                sx={{ mb: 3, textAlign: "center" }}
            >
                All Recipes 🍴
            </Typography>

            {/* Search bar and top actions */}
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="space-between"
                alignItems="center"
                sx={{ maxWidth: 900, mx: "auto", mb: 3 }}
            >
                <Box sx={{ flex: 1, maxWidth: 400 }}>
                    <SearchBar
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onClear={() => setSearchTerm("")}
                        placeholder="Search for a recipe..."
                    />
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<SortIcon />}
                        onClick={handleSortClick}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: "bold",
                            bgcolor: "#f4f7fb",
                        }}
                    >
                        Sort
                    </Button>
                    <Menu anchorEl={sortAnchor} open={!!sortAnchor} onClose={handleSortClose}>
                        <MenuItem
                            selected={sortBy === "date-desc"}
                            onClick={() => handleSortSelect("date-desc")}
                        >
                            Newest first
                        </MenuItem>
                        <MenuItem
                            selected={sortBy === "date-asc"}
                            onClick={() => handleSortSelect("date-asc")}
                        >
                            Oldest first
                        </MenuItem>
                        <MenuItem
                            selected={sortBy === "abc-asc"}
                            onClick={() => handleSortSelect("abc-asc")}
                        >
                            Title A-Z
                        </MenuItem>
                        <MenuItem
                            selected={sortBy === "abc-desc"}
                            onClick={() => handleSortSelect("abc-desc")}
                        >
                            Title Z-A
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            selected={sortBy === "total-asc"}
                            onClick={() => handleSortSelect("total-asc")}
                        >
                            Total Time: Shortest First
                        </MenuItem>
                        <MenuItem
                            selected={sortBy === "total-desc"}
                            onClick={() => handleSortSelect("total-desc")}
                        >
                            Total Time: Longest First
                        </MenuItem>
                    </Menu>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<FilterListIcon />}
                        onClick={handleFilterClick}
                        sx={{
                            borderRadius: 3,
                            textTransform: "none",
                            fontWeight: "bold",
                            bgcolor: "#f4f7fb",
                        }}
                    >
                        Filter
                    </Button>
                    <Menu
                        anchorEl={filterAnchor}
                        open={!!filterAnchor}
                        onClose={handleFilterClose}
                        PaperProps={{
                            sx: { minWidth: 230, p: 2, borderRadius: 3 },
                        }}
                    >
                        <Typography
                            fontWeight="bold"
                            fontSize="1.15rem"
                            sx={{ mb: 1, textAlign: "center" }}
                        >
                            Categories
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Stack direction="row" flexWrap="wrap" sx={{ mb: 1, gap: 0.5 }}>
                            <Chip
                                label="All"
                                color={selectedCategories.length === 0 ? "primary" : "default"}
                                clickable
                                onClick={() => {
                                    handleClearCategories();
                                    handleFilterClose();
                                }}
                                sx={{
                                    mb: 1,
                                    fontWeight: selectedCategories.length === 0 ? "bold" : "normal",
                                }}
                            />
                            {categories.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    label={cat.name}
                                    color={selectedCategories.includes(cat.id) ? "primary" : "default"}
                                    clickable
                                    onClick={() => handleCategoryClick(cat.id)}
                                    sx={{
                                        mb: 1,
                                        fontWeight: selectedCategories.includes(cat.id) ? "bold" : "normal",
                                    }}
                                />
                            ))}
                        </Stack>

                        <Divider sx={{ my: 1 }} />
                        <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                                variant={filter === "popular" ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => {
                                    setFilterAnchor(null);
                                    navigate("/recipes?filter=popular");
                                }}
                                sx={{ minWidth: 90 }}
                            >
                                Popular
                            </Button>
                            <Button
                                variant={filter === "new" ? "contained" : "outlined"}
                                color="primary"
                                onClick={() => {
                                    setFilterAnchor(null);
                                    navigate("/recipes?filter=new");
                                }}
                                sx={{ minWidth: 90 }}
                            >
                                New
                            </Button>
                        </Stack>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                            <Button size="small" onClick={handleFilterClose}>
                                Done
                            </Button>
                        </Box>
                    </Menu>
                    <IconButton
                        onClick={() => setIsGridView((prev) => !prev)} color="primary"
                        sx={{
                            bgcolor: "#f4f7fb",
                            borderRadius: 2,
                            border: "1px solid #A74458",
                            "&:hover": { bgcolor: "#eaeaea" },
                        }}
                    >
                        {isGridView ? <ViewListIcon /> : <GridViewIcon />}
                    </IconButton>
                </Stack>
            </Stack>
            {/* Recipes grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {Array.from({ length: RECIPES_PER_PAGE }).map((_, idx) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={idx}>
                            <Skeleton variant="rectangular" height={210} sx={{ borderRadius: 3 }} />
                        </Grid>
                    ))}
                </Grid>
            ) : error ? (
                <Typography color="error" align="center">
                    {error}
                </Typography>
            ) : (
                <>
                    <Stack spacing={2} width={"100%"}>
                        {paginatedRecipes.length === 0 ? (
                            <Typography color="text.secondary" align="center">
                                No recipes found matching your search/filter.
                            </Typography>
                        ) : isGridView ? (
                            <Grid container spacing={2}>
                                {paginatedRecipes.map((recipe) => (
                                    <Grid
                                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                        key={recipe.id}
                                    >
                                        <RecipeCard recipe={recipe} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Stack spacing={2} width="100%" maxWidth={900} margin={"0 auto !important"}>
                                {paginatedRecipes.map((recipe) => (
                                    <RecipeListItem key={recipe.id} recipe={recipe} />
                                ))}
                            </Stack>
                        )}
                    </Stack>
                    {/* Pagination control */}
                    {totalPages > 1 && (
                        <Stack direction="row" justifyContent="center" sx={{ mt: 6 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                variant="outlined"
                                size="large"
                                siblingCount={1}
                                boundaryCount={1}
                                showFirstButton
                                showLastButton
                                sx={{
                                    bgcolor: "#fafbfc",
                                    borderRadius: 3,
                                    boxShadow: 2,
                                    p: 2,
                                }}
                                renderItem={(item) => (
                                    <PaginationItem
                                        {...item}
                                        sx={{
                                            fontWeight: "bold",
                                            fontSize: "1.15rem",
                                            borderRadius: 2,
                                            border: "none",
                                            bgcolor: item.selected ? "primary.main" : "transparent",
                                            color: item.selected ? "#fff" : "primary.main",
                                            boxShadow: item.selected ? 2 : 0,
                                            "&:hover": {
                                                bgcolor: item.selected ? "primary.dark" : "#e5ecf5",
                                            },
                                            minWidth: 44,
                                            minHeight: 44,
                                            mx: 0.5,
                                        }}
                                    />
                                )}
                            />
                        </Stack>
                    )}
                </>
            )
            }
        </Paper >
    );
};

export default RecipesPage;
