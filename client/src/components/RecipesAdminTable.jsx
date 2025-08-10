import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, Typography, Chip, Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";  // <-- הוספה
import { Tooltip } from "@mui/material";


const API_URL = import.meta.env.VITE_API_URL;

const RecipesAdminTable = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // <-- הוספה

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const res = await fetch(`${API_URL}/api/admin/recipes`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setRecipes(data);
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // Block/unblock handler
    // const toggleActive = async (id, currentActive) => {
    //     try {
    //         let url, method = "PUT";
    //         if (currentActive) {
    //             url = `${API_URL}/api/recipes/${id}/deactivate`;
    //         } else {
    //             url = `${API_URL}/api/recipes/${id}/reactivate`;
    //         }
    //         const res = await fetch(url, {
    //             method,
    //             headers: {
    //                 Authorization: `Bearer ${localStorage.getItem("token")}`,
    //             },
    //         });
    //         if (res.ok) {
    //             setRecipes((prev) =>
    //                 prev.map((r) =>
    //                     r.id === id ? { ...r, active: currentActive ? 0 : 1 } : r
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Error updating recipe active status:", error);
    //     }
    // };



    const toggleActive = async (id, currentActive) => {
        try {
            const res = await fetch(`${API_URL}/api/recipes/${id}/active`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ active: currentActive ? 0 : 1 }),
            });

            if (res.ok) {
                setRecipes((prev) =>
                    prev.map((r) =>
                        r.id === id ? { ...r, active: currentActive ? 0 : 1 } : r
                    )
                );
            }
        } catch (error) {
            console.error("Error updating recipe active status:", error);
        }
    };

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" fontWeight={700} color="primary" p={2}>
                Recipe Management
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Categories</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : recipes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                No recipes found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        recipes.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell>
                                    {recipe.image ? (
                                        <img
                                            src={`${API_URL}/uploads/${recipe.image}`}
                                            alt={recipe.title}
                                            style={{
                                                width: 64,
                                                height: 64,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                border: "1px solid #eee"
                                            }}
                                        />
                                    ) : (
                                        <span style={{
                                            display: "inline-block",
                                            width: 64,
                                            height: 64,
                                            background: "#f0f0f0",
                                            borderRadius: 8,
                                            textAlign: "center",
                                            lineHeight: "64px",
                                            color: "#aaa"
                                        }}>
                                            No Image
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>{recipe.title}</TableCell>
                                <TableCell>{recipe.user?.username || recipe.username || "-"}</TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            maxWidth: 180
                                        }}
                                    >
                                        {recipe.description}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {recipe.created_at
                                        ? new Date(recipe.created_at).toLocaleDateString()
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" gap={1} flexWrap="wrap">
                                        {Array.isArray(recipe.categories) && recipe.categories.length > 0
                                            ? recipe.categories.map((cat) =>
                                                <Chip key={cat.id} label={cat.name} size="small" color="primary" />
                                            )
                                            : <Chip label="None" size="small" />}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    {recipe.active
                                        ? <Chip label="Active" color="info" />
                                        : <Chip label="Blocked" color="primary" />}
                                </TableCell>
                                <TableCell>
                                    <Tooltip
                                        title={
                                            recipe.userActive === 0 && recipe.active === 0
                                                ? "Cannot unblock this recipe while its creator is blocked"
                                                : ""
                                        }
                                    >
                                        <span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                onClick={() => toggleActive(recipe.id, recipe.active)}
                                                disabled={recipe.userActive === 0 && recipe.active === 0}
                                            >
                                                {recipe.active ? "Block" : "Unblock"}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        sx={{ mt: 1 }}
                                        onClick={() => navigate(`/edit/${recipe.id}`)}
                                    >
                                        Edit
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default RecipesAdminTable;
