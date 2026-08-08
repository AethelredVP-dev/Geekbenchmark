import { useMemo, useRef, useState } from "react";
import { Box, Card, Typography, Chip, Stack, useTheme } from "@mui/material";
import { buildAllPresets, BUDGET_PRESETS } from "../helpers/buildOptimizer";

// This component is built with CSS scroll-snap (no extra library needed).
// Each preset is a separate card that can be swiped/scrolled horizontally.

const partLabels = {
    cpu: "CPU",
    gpu: "GPU",
    ram: "RAM",
    motherboard: "Motherboard",
    "Disk-Space": "Storage",
    monitor: "Monitor",
};

const Presets = ({ db }) => {
    const theme = useTheme();
    const containerRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Pre-compute the best build for every preset — calculated only once
    const presetsData = useMemo(() => {
        if (!db) return [];
        return buildAllPresets(db, BUDGET_PRESETS);
    }, [db]);

    // On scroll, figure out which card is centered so the dots below update
    const handleScroll = () => {
        const el = containerRef.current;
        if (!el) return;
        const cardWidth = el.firstChild?.offsetWidth || 1;
        const index = Math.round(el.scrollLeft / (cardWidth + 16));
        setActiveIndex(index);
    };

    const scrollToIndex = (index) => {
        const el = containerRef.current;
        if (!el) return;
        const cardWidth = el.firstChild?.offsetWidth || 0;
        el.scrollTo({ left: index * (cardWidth + 16), behavior: "smooth" });
    };

    if (!db || presetsData.length === 0) {
        return <Typography textAlign="center">Loading builds...</Typography>;
    }

    return (
        <Box sx={{ width: "100%", py: 3 }}>
            <Typography variant="h5" textAlign="center" sx={{ fontWeight: 700, mb: 2 }}>
                Suggested Build by Budget
            </Typography>

            <Box
                ref={containerRef}
                onScroll={handleScroll}
                sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    px: 2,
                    pb: 2,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                }}
            >
                {presetsData.map(({ budget, parts, totalScore, totalPrice }) => (
                    <Card
                        key={budget}
                        sx={{
                            minWidth: { xs: "85%", sm: 340 },
                            flexShrink: 0,
                            scrollSnapAlign: "center",
                            p: 3,
                            borderRadius: 4,
                            boxShadow: 4,
                        }}
                    >
                        <Stack alignItems="center" spacing={1} sx={{ mb: 2 }}>
                            <Chip
                                label={`Budget: $${budget.toLocaleString("en-US")}`}
                                color="warning"
                                sx={{ fontWeight: 700, fontSize: 16, px: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Actual build cost: ${totalPrice.toLocaleString("en-US")}
                            </Typography>
                        </Stack>

                        <Stack spacing={1.2} divider={<Box sx={{ borderBottom: "1px solid", borderColor: "divider" }} />}>
                            {Object.entries(parts).map(([key, part]) => (
                                <Box key={key} sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                                        {partLabels[key] || key}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600, textAlign: "left", flex: 1 }}
                                    >
                                        {part ? part.title : "—"}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>

                        <Box
                            sx={{
                                mt: 2,
                                pt: 1.5,
                                borderTop: "2px solid",
                                borderColor: theme.palette.warning.main,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Total Benchmark Score
                            </Typography>
                            <Typography variant="h6" color="success.main" sx={{ fontWeight: 800 }}>
                                {totalScore}/600
                            </Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Bottom dots show the current position and are clickable for navigation */}
            <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                {presetsData.map((_, i) => (
                    <Box
                        key={i}
                        onClick={() => scrollToIndex(i)}
                        sx={{
                            width: i === activeIndex ? 20 : 8,
                            height: 8,
                            borderRadius: 4,
                            bgcolor: i === activeIndex ? "warning.main" : "grey.400",
                            transition: "all 0.25s ease",
                            cursor: "pointer",
                        }}
                    />
                ))}
            </Stack>
        </Box>
    );
};

export default Presets;