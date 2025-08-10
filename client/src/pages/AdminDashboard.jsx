import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Container, Paper } from "@mui/material";
import UsersAdminTable from "../components/UsersAdminTable";
import RecipesAdminTable from "../components/RecipesAdminTable";
import ReviewsAdminTable from "../components/ReviewsAdminTable";


const AdminDashboard = () => {
    const [tab, setTab] = useState(0);

    return (
        <Paper elevation={3}
            sx={{
                width: 1440,
                maxWidth: "100%",
                m: "0 auto",
                p: { xs: 2, md: 4 },
                borderRadius: 4,
                minHeight: 600,
            }}>
            <Typography variant="h4" fontWeight={700} mb={3} color="primary">
                Admin Dashboard
            </Typography>
            <Tabs
                value={tab}
                onChange={(_, newVal) => setTab(newVal)}
                sx={{ mb: 3 }}
            >
                <Tab label="Users" />
                <Tab label="Recipes" />
                <Tab label="Reviews" />


            </Tabs>
            <Box>
                {tab === 0 && <UsersAdminTable />}
                {tab === 1 && <RecipesAdminTable />}
                {tab === 2 && <ReviewsAdminTable />}
            </Box>
        </Paper>
    );
};

export default AdminDashboard;
