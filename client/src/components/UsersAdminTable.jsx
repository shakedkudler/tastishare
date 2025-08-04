// import React, { useEffect, useState } from "react";
// import {
//     Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//     Paper, Button, Avatar, Typography, Chip
// } from "@mui/material";

// const UsersAdminTable = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Fetch all users from the server
//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const res = await fetch("/api/users", {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 });
//                 const data = await res.json();
//                 setUsers(data);
//             } catch (error) {
//                 console.error("Error fetching users:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchUsers();
//     }, []);

//     // Toggle active status (block/unblock)
//     const toggleActive = async (id, currentActive) => {
//         try {
//             const res = await fetch(`/api/users/${id}/active`, {
//                 method: "PATCH",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//                 body: JSON.stringify({ active: currentActive ? 0 : 1 }),
//             });
//             if (res.ok) {
//                 setUsers((prev) =>
//                     prev.map((u) =>
//                         u.id === id ? { ...u, active: currentActive ? 0 : 1 } : u
//                     )
//                 );
//             }
//         } catch (error) {
//             console.error("Error updating active status:", error);
//         }
//     };

//     // Only non-admin users
//     const filteredUsers = users.filter(user => user.role !== "admin");

//     return (
//         <TableContainer component={Paper}>
//             <Typography variant="h6" fontWeight={700} color="primary" p={2}>
//                 User Management
//             </Typography>
//             <Table>
//                 <TableHead>
//                     <TableRow>
//                         <TableCell>Avatar</TableCell>
//                         <TableCell>Username</TableCell>
//                         <TableCell>Email</TableCell>
//                         <TableCell>Status</TableCell>
//                         <TableCell>Actions</TableCell>
//                     </TableRow>
//                 </TableHead>
//                 <TableBody>
//                     {loading ? (
//                         <TableRow>
//                             <TableCell colSpan={5} align="center">
//                                 Loading...
//                             </TableCell>
//                         </TableRow>
//                     ) : filteredUsers.length === 0 ? (
//                         <TableRow>
//                             <TableCell colSpan={5} align="center">
//                                 No users found.
//                             </TableCell>
//                         </TableRow>
//                     ) : (
//                         filteredUsers.map((user) => (
//                             <TableRow key={user.id}>
//                                 <TableCell>
//                                     <Avatar src={user.avatar ? `/Avatars/${user.avatar}` : ""}>
//                                         {user.username?.charAt(0).toUpperCase()}
//                                     </Avatar>
//                                 </TableCell>
//                                 <TableCell>{user.username}</TableCell>
//                                 <TableCell>{user.email}</TableCell>
//                                 <TableCell>
//                                     {user.active
//                                         ? <Chip label="Active" color="success" />
//                                         : <Chip label="Blocked" color="error" />}
//                                 </TableCell>
//                                 <TableCell>
//                                     <Button
//                                         variant="outlined"
//                                         color={user.active ? "error" : "success"}
//                                         size="small"
//                                         sx={{ ml: 1 }}
//                                         onClick={() => toggleActive(user.id, user.active)}
//                                     >
//                                         {user.active ? "Block" : "Unblock"}
//                                     </Button>
//                                     <Button
//                                         variant="contained"
//                                         color="primary"
//                                         size="small"
//                                         disabled // until you implement edit
//                                     >
//                                         Edit
//                                     </Button>
//                                 </TableCell>
//                             </TableRow>
//                         ))
//                     )}
//                 </TableBody>
//             </Table>
//         </TableContainer>
//     );
// };

// export default UsersAdminTable;
import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Avatar,
    Typography,
    Chip,
} from "@mui/material";

const UsersAdminTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all users from the server
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/users", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    // Toggle active status (block/unblock)
    const toggleActive = async (id, currentActive) => {
        try {
            const res = await fetch(`/api/users/${id}/active`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ active: currentActive ? 0 : 1 }),
            });
            if (res.ok) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === id ? { ...u, active: currentActive ? 0 : 1 } : u
                    )
                );
            }
        } catch (error) {
            console.error("Error updating active status:", error);
        }
    };

    // Only non-admin users
    const filteredUsers = users.filter((user) => user.role !== "admin");

    return (
        <TableContainer component={Paper}>
            <Typography variant="h6" fontWeight={700} color="primary" p={2}>
                User Management
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Avatar</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                Loading...
                            </TableCell>
                        </TableRow>
                    ) : filteredUsers.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} align="center">
                                No users found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <Avatar src={user.avatar ? `/Avatars/${user.avatar}` : ""}>
                                        {user.username?.charAt(0).toUpperCase()}
                                    </Avatar>
                                </TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.active ? (
                                        <Chip label="Active" color="success" />
                                    ) : (
                                        <Chip label="Blocked" color="error" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        color={user.active ? "error" : "success"}
                                        size="small"
                                        sx={{ ml: 1 }}
                                        onClick={() => toggleActive(user.id, user.active)}
                                    >
                                        {user.active ? "Block" : "Unblock"}
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

export default UsersAdminTable;
