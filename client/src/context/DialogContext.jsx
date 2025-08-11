import { createContext, useContext, useState, useCallback, useMemo, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const DialogContext = createContext(null);

const DEFAULTS = {
    body: null,
    confirmText: null,
    cancelText: null,
    onConfirm: null,
    onCancel: null,
    awaitOnConfirm: false,
    awaitOnCancel: false,
    fullWidth: true,
    maxWidth: "xs",
    minHeight: 150
};

export function DialogProvider({ children }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState(DEFAULTS);
    const resolverRef = useRef(null);

    const closeDialog = useCallback(() => setOpen(false), []);

    const cleanup = useCallback(() => {
        resolverRef.current = null;
        setOptions(DEFAULTS);
    }, []);

    const openDialog = useCallback((opts) => {
        return new Promise((resolve) => {
            resolverRef.current = resolve;
            setOptions({ ...DEFAULTS, ...(opts || {}) });
            setOpen(true);
        });
    }, []);

    const value = useMemo(() => ({ openDialog, closeDialog }), [openDialog, closeDialog]);

    const opts = options || DEFAULTS;

    const resolveAndClose = useCallback((result) => {
        resolverRef.current?.(result);
        closeDialog();
    }, [closeDialog]);

    const handleDialogClose = useCallback(() => {
        resolveAndClose(false);
    }, [resolveAndClose]);

    const handleCancel = useCallback(async () => {
        try {
            if (opts.onCancel) {
                const maybe = opts.onCancel();
                if (opts.awaitOnCancel && maybe?.then) await maybe;
            }
        } finally {
            resolveAndClose(false);
        }
    }, [opts, resolveAndClose]);

    const handleConfirm = useCallback(async () => {
        try {
            if (opts.onConfirm) {
                const maybe = opts.onConfirm();
                if (opts.awaitOnConfirm && maybe?.then) await maybe;
            }
        } finally {
            resolveAndClose(true);
        }
    }, [opts, resolveAndClose]);

    return (
        <DialogContext.Provider value={value}>
            {children}
            <Dialog
                open={open}
                onClose={handleDialogClose}
                onTransitionExited={cleanup}
                fullWidth={opts.fullWidth}
                maxWidth={opts.maxWidth}
                keepMounted
            >
                <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
                    <IconButton aria-label="close" onClick={handleDialogClose} color="primary">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent
                    sx={{
                        pt: 5,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        minHeight: opts.minHeight
                    }}
                >
                    {opts.body}
                </DialogContent>
                {(opts.confirmText || opts.cancelText) && (
                    <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2.5 }}>
                        {opts.cancelText && (
                            <Button onClick={handleCancel}>{opts.cancelText}</Button>
                        )}
                        {opts.confirmText && (
                            <Button variant="contained" onClick={handleConfirm}>
                                {opts.confirmText}
                            </Button>
                        )}
                    </DialogActions>
                )}
            </Dialog>
        </DialogContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDialog() {
    const ctx = useContext(DialogContext);
    if (!ctx) throw new Error("useDialog must be used within DialogProvider");
    return ctx;
}
