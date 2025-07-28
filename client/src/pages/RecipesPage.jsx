// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//     Paper,
//     Box,
//     Typography,
//     Grid,
//     Skeleton,
//     Stack,
//     Chip,
//     Button,
//     Menu,
//     MenuItem,
//     Divider,
//     Pagination,
//     PaginationItem,
// } from "@mui/material";
// import SortIcon from "@mui/icons-material/Sort";
// import FilterListIcon from "@mui/icons-material/FilterList";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import SearchBar from "./../components/SearchBar";
// import { useAuth } from "../context/AuthContext";

// const RECIPES_PER_PAGE = 8;

// const RecipesPage = () => {
//     const [recipes, setRecipes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [searchTerm, setSearchTerm] = useState("");
//     const [categories, setCategories] = useState([]);
//     const [selectedCategories, setSelectedCategories] = useState([]);
//     const [sortAnchor, setSortAnchor] = useState(null);
//     const [filterAnchor, setFilterAnchor] = useState(null);
//     const [sortBy, setSortBy] = useState("date-desc");
//     const [page, setPage] = useState(1);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const { logout } = useAuth();

//     const queryParams = new URLSearchParams(location.search);
//     const filter = queryParams.get("filter");

//     useEffect(() => {
//         const fetchRecipes = async () => {
//             setLoading(true);
//             try {
//                 let url = `http://localhost:3001/api/recipes`;

//                 if (filter === "popular") {
//                     url = `http://localhost:3001/api/recipes/popular`;
//                 } else if (filter === "new") {
//                     url = `http://localhost:3001/api/recipes/new`;
//                 }

//                 const res = await fetch(url);
//                 if (!res.ok) {
//                     if (res.status === 401 || res.status === 403) logout();
//                     navigate("/");
//                 }
//                 const data = await res.json();
//                 setRecipes(data);
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchRecipes();
//     }, [filter, logout, navigate]);

//     useEffect(() => {
//         const fetchCategories = async () => {
//             try {
//                 const res = await fetch("http://localhost:3001/api/categories");
//                 if (!res.ok) {
//                     if (res.status === 401 || res.status === 403) logout();
//                     navigate("/");
//                 }
//                 const data = await res.json();
//                 setCategories(data);
//             } catch {
//                 // Optional error handling
//             }
//         };
//         fetchCategories();
//     }, [logout, navigate]);

//     const handleCategoryClick = (catId) => {
//         setSelectedCategories((prev) =>
//             prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
//         );
//     };
//     const handleClearCategories = () => setSelectedCategories([]);

//     const handleSortClick = (e) => setSortAnchor(e.currentTarget);
//     const handleSortClose = () => setSortAnchor(null);
//     const handleSortSelect = (sortOption) => {
//         setSortBy(sortOption);
//         setSortAnchor(null);
//     };

//     const handleFilterClick = (e) => setFilterAnchor(e.currentTarget);
//     const handleFilterClose = () => setFilterAnchor(null);

//     const filteredRecipes = recipes.filter((recipe) => {
//         const matchesSearch = recipe.title
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase());
//         if (selectedCategories.length === 0) return matchesSearch;
//         const recipeCategoryIds = (recipe.categories || []).map((cat) => cat.id);
//         const matchesCategories = selectedCategories.every((catId) =>
//             recipeCategoryIds.includes(catId)
//         );
//         return matchesSearch && matchesCategories;
//     });

//     const clientSortedRecipes = (() => {
//         if (sortBy === "abc-asc")
//             return [...filteredRecipes].sort((a, b) =>
//                 a.title.localeCompare(b.title, undefined, { sensitivity: "base" })
//             );
//         if (sortBy === "abc-desc")
//             return [...filteredRecipes].sort((a, b) =>
//                 b.title.localeCompare(a.title, undefined, { sensitivity: "base" })
//             );
//         if (sortBy === "date-asc")
//             return [...filteredRecipes].sort(
//                 (a, b) => new Date(a.created_at) - new Date(b.created_at)
//             );
//         if (sortBy === "date-desc")
//             return [...filteredRecipes].sort(
//                 (a, b) => new Date(b.created_at) - new Date(a.created_at)
//             );
//         if (sortBy === "total-asc")
//             return [...filteredRecipes].sort(
//                 (a, b) => Number(a.total_time) - Number(b.total_time)
//             );
//         if (sortBy === "total-desc")
//             return [...filteredRecipes].sort(
//                 (a, b) => Number(b.total_time) - Number(a.total_time)
//             );
//         return filteredRecipes;
//     })();

//     const totalPages = Math.ceil(clientSortedRecipes.length / RECIPES_PER_PAGE);
//     const paginatedRecipes = clientSortedRecipes.slice(
//         (page - 1) * RECIPES_PER_PAGE,
//         page * RECIPES_PER_PAGE
//     );
//     const handlePageChange = (e, value) => setPage(value);

//     useEffect(() => {
//         setPage(1);
//     }, [searchTerm, selectedCategories, sortBy]);

//     return (
//         <Paper
//             elevation={3}
//             sx={{
//                 width: "100%",
//                 maxWidth: 1440,
//                 m: "0 auto",
//                 p: { xs: 1, md: 4 },
//                 borderRadius: 4,
//                 minHeight: "80vh",
//                 bgcolor: "#fff",
//             }}
//         >
//             <Typography
//                 variant="h3"
//                 fontWeight="bold"
//                 sx={{ mb: 3, textAlign: "center" }}
//             >
//                 All Recipes 🍴
//             </Typography>

//             {/* Search bar and top actions */}
//             <Stack
//                 direction={{ xs: "column", sm: "row" }}
//                 spacing={2}
//                 justifyContent="space-between"
//                 alignItems="center"
//                 sx={{ maxWidth: 900, mx: "auto", mb: 3 }}
//             >
//                 <Box sx={{ flex: 1, maxWidth: 400 }}>
//                     <SearchBar
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         onClear={() => setSearchTerm("")}
//                         placeholder="Search for a recipe..."
//                     />
//                 </Box>
//                 <Stack direction="row" spacing={1}>
//                     <Button
//                         variant="outlined"
//                         color="primary"
//                         startIcon={<SortIcon />}
//                         onClick={handleSortClick}
//                         sx={{
//                             borderRadius: 3,
//                             textTransform: "none",
//                             fontWeight: "bold",
//                             bgcolor: "#f4f7fb",
//                         }}
//                     >
//                         Sort
//                     </Button>
//                     <Menu anchorEl={sortAnchor} open={!!sortAnchor} onClose={handleSortClose}>
//                         <MenuItem
//                             selected={sortBy === "date-desc"}
//                             onClick={() => handleSortSelect("date-desc")}
//                         >
//                             Newest first
//                         </MenuItem>
//                         <MenuItem
//                             selected={sortBy === "date-asc"}
//                             onClick={() => handleSortSelect("date-asc")}
//                         >
//                             Oldest first
//                         </MenuItem>
//                         <MenuItem
//                             selected={sortBy === "abc-asc"}
//                             onClick={() => handleSortSelect("abc-asc")}
//                         >
//                             Title A-Z
//                         </MenuItem>
//                         <MenuItem
//                             selected={sortBy === "abc-desc"}
//                             onClick={() => handleSortSelect("abc-desc")}
//                         >
//                             Title Z-A
//                         </MenuItem>
//                         <Divider />
//                         <MenuItem
//                             selected={sortBy === "total-asc"}
//                             onClick={() => handleSortSelect("total-asc")}
//                         >
//                             Total Time: Shortest First
//                         </MenuItem>
//                         <MenuItem
//                             selected={sortBy === "total-desc"}
//                             onClick={() => handleSortSelect("total-desc")}
//                         >
//                             Total Time: Longest First
//                         </MenuItem>
//                     </Menu>
//                     <Button
//                         variant="outlined"
//                         color="primary"
//                         startIcon={<FilterListIcon />}
//                         onClick={handleFilterClick}
//                         sx={{
//                             borderRadius: 3,
//                             textTransform: "none",
//                             fontWeight: "bold",
//                             bgcolor: "#f4f7fb",
//                         }}
//                     >
//                         Filter
//                     </Button>
//                     <Menu
//                         anchorEl={filterAnchor}
//                         open={!!filterAnchor}
//                         onClose={handleFilterClose}
//                         PaperProps={{
//                             sx: { minWidth: 230, p: 2, borderRadius: 3 },
//                         }}
//                     >
//                         <Typography
//                             fontWeight="bold"
//                             fontSize="1.15rem"
//                             sx={{ mb: 1, textAlign: "center" }}
//                         >
//                             Categories
//                         </Typography>
//                         <Divider sx={{ mb: 1 }} />
//                         <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
//                             <Chip
//                                 label="All"
//                                 color={selectedCategories.length === 0 ? "primary" : "default"}
//                                 clickable
//                                 onClick={() => {
//                                     handleClearCategories();
//                                     handleFilterClose();
//                                 }}
//                                 sx={{
//                                     mb: 1,
//                                     fontWeight: selectedCategories.length === 0 ? "bold" : "normal",
//                                 }}
//                             />
//                             {categories.map((cat) => (
//                                 <Chip
//                                     key={cat.id}
//                                     label={cat.name}
//                                     color={selectedCategories.includes(cat.id) ? "primary" : "default"}
//                                     clickable
//                                     onClick={() => handleCategoryClick(cat.id)}
//                                     sx={{
//                                         mb: 1,
//                                         fontWeight: selectedCategories.includes(cat.id) ? "bold" : "normal",
//                                     }}
//                                 />
//                             ))}
//                         </Stack>

//                         <Divider sx={{ my: 1 }} />
//                         <Stack direction="row" spacing={1} justifyContent="center">
//                             <Button
//                                 variant={filter === "popular" ? "contained" : "outlined"}
//                                 color="primary"
//                                 onClick={() => {
//                                     setFilterAnchor(null);
//                                     navigate("/recipes?filter=popular");
//                                 }}
//                                 sx={{ minWidth: 90 }}
//                             >
//                                 Popular
//                             </Button>
//                             <Button
//                                 variant={filter === "new" ? "contained" : "outlined"}
//                                 color="primary"
//                                 onClick={() => {
//                                     setFilterAnchor(null);
//                                     navigate("/recipes?filter=new");
//                                 }}
//                                 sx={{ minWidth: 90 }}
//                             >
//                                 New
//                             </Button>
//                         </Stack>

//                         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
//                             <Button size="small" onClick={handleFilterClose}>
//                                 Done
//                             </Button>
//                         </Box>
//                     </Menu>
//                 </Stack>
//             </Stack>

//             {/* Recipes grid */}
//             {loading ? (
//                 <Grid container spacing={3}>
//                     {Array.from({ length: RECIPES_PER_PAGE }).map((_, idx) => (
//                         <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
//                             <Skeleton variant="rectangular" height={210} sx={{ borderRadius: 3 }} />
//                         </Grid>
//                     ))}
//                 </Grid>
//             ) : error ? (
//                 <Typography color="error" align="center">
//                     {error}
//                 </Typography>
//             ) : (
//                 <>
//                     <Grid container spacing={3} justifyContent="center">
//                         {paginatedRecipes.length === 0 ? (
//                             <Grid item xs={12}>
//                                 <Typography color="text.secondary" align="center">
//                                     No recipes found matching your search/filter.
//                                 </Typography>
//                             </Grid>
//                         ) : (
//                             paginatedRecipes.map((recipe) => (
//                                 <Grid
//                                     item
//                                     xs={12}
//                                     sm={6}
//                                     md={4}
//                                     lg={3}
//                                     key={recipe.id}
//                                     sx={{
//                                         display: "flex",
//                                         flexDirection: "column",
//                                         height: "100%",
//                                         justifyContent: "stretch",
//                                     }}
//                                 >
//                                     <Paper
//                                         elevation={2}
//                                         sx={{
//                                             p: 2,
//                                             borderRadius: 3,
//                                             height: 350,
//                                             width: { xs: "100%", sm: 280 },
//                                             display: "flex",
//                                             flexDirection: "column",
//                                             justifyContent: "flex-start",
//                                             cursor: "pointer",
//                                             "&:hover": { boxShadow: 6 },
//                                         }}
//                                         component={Link}
//                                         to={`/recipe/${recipe.id}`}
//                                         style={{ textDecoration: "none", color: "inherit" }}
//                                     >
//                                         <Typography
//                                             variant="h6"
//                                             fontWeight="bold"
//                                             sx={{ mb: 1, minHeight: 32 }}
//                                         >
//                                             {recipe.title}
//                                         </Typography>
//                                         <Typography
//                                             variant="body2"
//                                             color="text.secondary"
//                                             sx={{
//                                                 mb: 1,
//                                                 overflow: "hidden",
//                                                 display: "-webkit-box",
//                                                 WebkitLineClamp: 2,
//                                                 WebkitBoxOrient: "vertical",
//                                                 textOverflow: "ellipsis",
//                                                 whiteSpace: "normal",
//                                                 minHeight: "3em",
//                                             }}
//                                         >
//                                             {recipe.description}
//                                         </Typography>
//                                         <Stack direction="column" spacing={0.5} sx={{ mb: 1 }}>
//                                             <Stack direction="row" alignItems="center" spacing={0.5}>
//                                                 <AccessTimeIcon fontSize="small" color="action" />
//                                                 <Typography
//                                                     variant="body2"
//                                                     color="text.secondary"
//                                                     fontWeight="bold"
//                                                 >
//                                                     Prep: {recipe.prep_time || "-"} min &nbsp;|&nbsp;
//                                                     Cook: {recipe.cook_time || "-"} min &nbsp;|&nbsp;
//                                                     Total: {recipe.total_time || "-"} min
//                                                 </Typography>
//                                             </Stack>
//                                         </Stack>
//                                         {recipe.categories && recipe.categories.length > 0 && (
//                                             <Stack
//                                                 direction="row"
//                                                 spacing={1}
//                                                 sx={{ mb: 1, flexWrap: "wrap" }}
//                                             >
//                                                 {recipe.categories.map((cat) => (
//                                                     <Chip
//                                                         key={cat.id}
//                                                         label={cat.name}
//                                                         size="small"
//                                                         sx={{ bgcolor: "#e7f4fa" }}
//                                                     />
//                                                 ))}
//                                             </Stack>
//                                         )}
//                                         {recipe.image && (
//                                             <Box
//                                                 component="img"
//                                                 src={`http://localhost:3001/uploads/${recipe.image}`}
//                                                 alt={recipe.title}
//                                                 sx={{
//                                                     width: "100%",
//                                                     borderRadius: 2,
//                                                     mt: "auto",
//                                                     objectFit: "cover",
//                                                     minHeight: { xs: 70, sm: 80, md: 100 },
//                                                     maxHeight: { xs: 90, sm: 110, md: 120 },
//                                                     backgroundColor: "#f5f6fa",
//                                                     display: "block",
//                                                 }}
//                                             />
//                                         )}
//                                     </Paper>
//                                 </Grid>
//                             ))
//                         )}
//                     </Grid>

//                     {/* Pagination control */}
//                     {totalPages > 1 && (
//                         <Stack direction="row" justifyContent="center" sx={{ mt: 6 }}>
//                             <Pagination
//                                 count={totalPages}
//                                 page={page}
//                                 onChange={handlePageChange}
//                                 color="primary"
//                                 shape="rounded"
//                                 variant="outlined"
//                                 size="large"
//                                 siblingCount={1}
//                                 boundaryCount={1}
//                                 showFirstButton
//                                 showLastButton
//                                 sx={{
//                                     bgcolor: "#fafbfc",
//                                     borderRadius: 3,
//                                     boxShadow: 2,
//                                     p: 2,
//                                     ".MuiPagination-ul": { gap: 1.5 },
//                                 }}
//                                 renderItem={(item) => (
//                                     <PaginationItem
//                                         {...item}
//                                         sx={{
//                                             fontWeight: "bold",
//                                             fontSize: "1.15rem",
//                                             borderRadius: 2,
//                                             border: "none",
//                                             bgcolor: item.selected ? "primary.main" : "transparent",
//                                             color: item.selected ? "#fff" : "primary.main",
//                                             boxShadow: item.selected ? 2 : 0,
//                                             "&:hover": {
//                                                 bgcolor: item.selected ? "primary.dark" : "#e5ecf5",
//                                             },
//                                             minWidth: 44,
//                                             minHeight: 44,
//                                             mx: 0.5,
//                                         }}
//                                     />
//                                 )}
//                             />
//                         </Stack>
//                     )}
//                 </>
//             )}
//         </Paper>
//     );
// };

// export default RecipesPage;

import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import FilterListIcon from "@mui/icons-material/FilterList";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SearchBar from "./../components/SearchBar";
import { useAuth } from "../context/AuthContext";

const RECIPES_PER_PAGE = 8;

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
                variant="h3"
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
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
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
                </Stack>
            </Stack>

            {/* Recipes grid */}
            {loading ? (
                <Grid container spacing={3}>
                    {Array.from({ length: RECIPES_PER_PAGE }).map((_, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
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
                    <Grid container spacing={2}>
                        {paginatedRecipes.length === 0 ? (
                            <Grid item size={{ sm: 12 }}>
                                <Typography color="text.secondary" align="center">
                                    No recipes found matching your search/filter.
                                </Typography>
                            </Grid>
                        ) : (
                            paginatedRecipes.map((recipe) => {
                                const categoriesToShow = recipe.categories?.slice(0, 3) || [];
                                const hasMoreCategories = (recipe.categories?.length || 0) > 3;

                                return (
                                    <Grid
                                        item
                                        size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                        key={recipe.id}
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "stretch",
                                        }}
                                    >
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
                                                variant="h6"
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
                                                        {/* Prep: {recipe.prep_time || "-"} min &nbsp;|&nbsp;
                                                        Cook: {recipe.cook_time || "-"} min &nbsp;|&nbsp; */}
                                                        {/* Total:  */}
                                                        {recipe.total_time || "-"} min
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                            {categoriesToShow.length > 0 && (
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    sx={{ mb: 1, flexWrap: "wrap" }}
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
                                        </Paper>
                                    </Grid>
                                );
                            })
                        )}
                    </Grid>

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
                                    ".MuiPagination-ul": { gap: 1.5 },
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
