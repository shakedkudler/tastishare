// import React, { useEffect, useState } from "react";
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, Typography, Chip, Button, Tooltip
// } from "@mui/material";

// const API_URL = import.meta.env.VITE_API_URL;

// const ReviewsAdminTable = () => {
//     const [reviews, setReviews] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchReviews = async () => {
//         try {
//             const res = await fetch(`${API_URL}/api/admin/reviews`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             const data = await res.json();
//             setReviews(data);
//         } catch (err) {
//             console.error("Error fetching reviews:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchReviews();
//     }, []);

//     const toggleReview = async (id, currentActive, userActive) => {
//         if (!currentActive && userActive === 0) return;

//         try {
//             const res = await fetch(`${API_URL}/api/reviews/${id}/active`, {
//                 method: "PATCH",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ active: currentActive ? 0 : 1 }),
//             });

//             if (res.ok) {
//                 setReviews((prev) =>
//                     prev.map((r) =>
//                         r.id === id ? { ...r, active: currentActive ? 0 : 1 } : r
//                     )
//                 );
//             }
//         } catch (err) {
//             console.error("Error updating review:", err);
//         }
//     };

//     return (
//         <TableContainer component={Paper} sx={{ mt: 4 }}>
//             <Typography variant="h6" fontWeight={700} color="primary" p={2}>
//                 Review Management
//             </Typography>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Recipe</TableCell>
//                         <TableCell>Reviewer</TableCell>
//                         <TableCell>Rating</TableCell>
//                         <TableCell>Comment</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {loading ? (
//                         <TableRow>
//                             <TableCell colSpan={6} align="center">Loading...</TableCell>
//                         </TableRow>
//                     ) : reviews.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={6} align="center">No reviews found.</TableCell>
//                         </TableRow>
//                     ) : (
//                         reviews.map((review) => (
//                             <TableRow key={review.id}>
//                                 <TableCell>{review.recipe_title}</TableCell>
//                                 <TableCell>{review.username}</TableCell>
//                                 <TableCell>{review.rating}</TableCell>
//                                 <TableCell>{review.comment}</TableCell>
//                                 <TableCell>
//                                     <Chip
//                                         label={review.active ? "Visible" : "Hidden"}
//                                         color={review.active ? "success" : "error"}
//                                     />
//                                 </TableCell>
//                                 <TableCell>
//                                     <Tooltip
//                                         title={
//                                             !review.active && review.user_active === 0
//                                                 ? "Cannot restore: user is blocked"
//                                                 : review.active
//                                                     ? "Hide review"
//                                                     : "Restore review"
//                                         }
//                                     >
//                                         <span>
//                                             <Button
//                                                 variant="outlined"
//                                                 color={review.active ? "error" : "success"}
//                                                 size="small"
//                                                 disabled={!review.active && review.user_active === 0}
//                                                 onClick={() =>
//                                                     toggleReview(review.id, review.active, review.user_active)
//                                                 }
//                                             >
//                                                 {review.active ? "Hide" : "Restore"}
//                                             </Button>
//                                         </span>
//                                     </Tooltip>
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     )}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };

// export default ReviewsAdminTable;
import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Typography, Chip, Button, Tooltip
} from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

const ReviewsAdminTable = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/reviews`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            setReviews(data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const toggleReview = async (id, currentActive, userActive, recipeActive) => {
        if (!currentActive && (userActive === 0 || recipeActive === 0)) return;

        try {
            const res = await fetch(`${API_URL}/api/reviews/${id}/active`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ active: currentActive ? 0 : 1 }),
                });

            if (res.ok) {
                setReviews((prev) =>
                    prev.map((r) =>
                        r.id === id ? { ...r, active: currentActive ? 0 : 1 } : r
                    )
                );
            }
        } catch (err) {
            console.error("Error updating review:", err);
        }
    };

    return (
        <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={700} color="primary" p={2}>
                Review Management
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Recipe</TableCell>
                        <TableCell>Reviewer</TableCell>
                        <TableCell>Rating</TableCell>
                        <TableCell>Comment</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">Loading...</TableCell>
                        </TableRow>
                    ) : reviews.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">No reviews found.</TableCell>
                        </TableRow>
                    ) : (
                        reviews.map((review) => (
                            <TableRow key={review.id}>
                                <TableCell>{review.recipe_title}</TableCell>
                                <TableCell>{review.username}</TableCell>
                                <TableCell>{review.rating}</TableCell>
                                <TableCell>{review.comment}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={review.active ? "Visible" : "Hidden"}
                                        color={review.active ? "info" : "primary"}
                                    />
                                </TableCell>
                                <TableCell>
                                    {/* <Tooltip
                                        title={
                                            !review.active && (review.user_active === 0 || review.recipe_active === 0)
                                                ? "Cannot restore: user or recipe is blocked"
                                                : review.active
                                                    ? "Hide review"
                                                    : "Restore review"
                                        }
                                    >
                                        <span>
                                            <Button
                                                variant="outlined"
                                                color={review.active ? "error" : "success"}
                                                size="small"
                                                disabled={!review.active && (review.user_active === 0 || review.recipe_active === 0)}
                                                onClick={() =>
                                                    toggleReview(review.id, review.active, review.user_active, review.recipe_active)
                                                }
                                            >
                                                {review.active ? "Hide" : "Restore"}
                                            </Button>
                                        </span>
                                    </Tooltip> */}
                                    <Tooltip
                                        title={
                                            !review.active && (!review.user_active || !review.recipe_active || !review.recipe_owner_active)
                                                ? `Cannot restore: ${[
                                                    !review.user_active && "reviewer",
                                                    !review.recipe_owner_active && "recipe owner",
                                                    !review.recipe_active && "recipe"
                                                ].filter(Boolean).join(" and ")
                                                } ${[
                                                    !review.user_active,
                                                    !review.recipe_owner_active,
                                                    !review.recipe_active
                                                ].filter(Boolean).length > 1 ? "are" : "is"} blocked`
                                                : review.active
                                                    ? "Hide review"
                                                    : "Restore review"
                                        }
                                    >
                                        <span>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                disabled={
                                                    !review.active &&
                                                    (!review.user_active || !review.recipe_active || !review.recipe_owner_active)
                                                }
                                                onClick={() =>
                                                    toggleReview(
                                                        review.id,
                                                        review.active,
                                                        review.user_active,
                                                        review.recipe_active,
                                                        review.recipe_owner_active
                                                    )
                                                }
                                            >
                                                {review.active ? "Hide" : "Restore"}
                                            </Button>
                                        </span>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReviewsAdminTable;
