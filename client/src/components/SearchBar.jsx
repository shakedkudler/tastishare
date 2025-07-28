import React from "react";
import { TextField, InputAdornment, IconButton, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

const SearchBar = ({ value, onChange, placeholder = "Search...", onClear }) => (
    <Paper
        elevation={2}
        sx={{
            p: "2px 6px",
            display: "flex",
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
            borderRadius: 3,
            bgcolor: "#f6f9fb",
            boxShadow: "0 2px 12px 0 #0001"
        }}
    >
        <TextField
            variant="standard"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            fullWidth
            InputProps={{
                disableUnderline: true,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon color="primary" />
                    </InputAdornment>
                ),
                endAdornment: value ? (
                    <InputAdornment position="end">
                        <IconButton onClick={onClear} size="small" aria-label="clear search">
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ) : null
            }}
            sx={{
                ml: 1,
                flex: 1,
                fontSize: 18,
                bgcolor: "transparent"
            }}
            inputProps={{ style: { fontSize: 18 } }}
        />
    </Paper>
);

export default SearchBar;
