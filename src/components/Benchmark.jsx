import React, { useEffect, useContext } from 'react';
import { runUltimateBenchmark } from '../benchmark/ultimateBenchamrk';
import { context } from '../helpers/CONTEXT';
import { Box, Typography } from '@mui/material';
import { GrGamepad } from "react-icons/gr";
import gamesDataImport from '../helpers/games.json';
import { FadeLoader } from "react-spinners";

const Benchmark = () => {
    const { specs, gamesData, report, setGamesData, setReport, loading, setLoading } = useContext(context);

    useEffect(() => {
        const prepareBenchmark = async () => {
            // 2. Simply use the imported data instead of fetching
            let currentGamesData = gamesData.length > 0 ? gamesData : gamesDataImport;

            if (gamesData.length === 0) {
                setGamesData(currentGamesData);
            }

            const formattedSelection = {
                cpu: { title: specs?.cpu?.title || "CPU", score: specs?.cpu?.score || 50 },
                gpu: { title: specs?.gpu?.title || "GPU", score: specs?.gpu?.score || 50 },
                ram: { title: specs?.ram?.title || "RAM", score: specs?.ram?.score || 50 },
                'Disk-Space': { title: specs?.['Disk-Space']?.title || "Storage", score: specs?.['Disk-Space']?.score || 50 },
                motherboard: { title: specs?.motherboard?.title || "Motherboard", score: specs?.motherboard?.score || 50 },
                monitor: { title: specs?.monitor?.title || "Monitor", score: specs?.monitor?.score || 50 }
            };

            const finalResult = runUltimateBenchmark(formattedSelection, currentGamesData);
            setReport(finalResult);

            setTimeout(() => {
                setLoading(false);
            }, 3000);
        };

        prepareBenchmark();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <FadeLoader color="#D4AF37" />
            ) : (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    width: '100%',
                    boxSizing: 'border-box'
                }}>
                    {report && !report.error && (
                        <Box sx={{ width: '100%', px: 3 }}>
                            {/* Score Overview Section */}
                            <Box sx={{ bgcolor: 'background.default', color: "text.primary", p: 3, borderRadius: 2, mb: 2, textAlign: 'center' }}>
                                <Typography variant='h4' sx={{ mb: 1 }}>
                                    Overall Score: {report.systemReport.overallScore}
                                </Typography>
                                <Typography variant='h5' sx={{ color: report.systemReport.tier.color }}>
                                    System Tier: {report.systemReport.tier.label}
                                </Typography>
                            </Box>

                            {/* Bottleneck Warning Section */}
                            {report.systemReport.bottleneck.hasBottleneck && (
                                <Box sx={{ bgcolor: "warning.main", p: 2, borderRadius: 2, mb: 2, borderLeft: '4px solid orange' }}>
                                    <Typography variant='body1'>
                                        ⚠️ {report.systemReport.bottleneck.message}
                                    </Typography>
                                </Box>
                            )}

                            {/* Estimated FPS Header */}
                            <Typography variant='h6' sx={{ mb: 2, mt: 3, display: 'flex', alignItems: 'center' }}>
                                <GrGamepad style={{ marginRight: "8px" }} /> Estimated FPS:
                            </Typography>

                            {/* Game Rankings Container - Responsive Flex Layout */}
                            <Box sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1.5,
                                width: '100%'
                            }}>
                                {report.gameRankings.map((game) => (
                                    <Box
                                        key={game.id}
                                        sx={{
                                            flex: '1 1 calc(33.333% - 16px)', // Responsive 3-column layout
                                            minWidth: '250px',
                                            bgcolor: 'background.paper',
                                            p: 2,
                                            borderRadius: 2,
                                            borderLeft: '4px solid #D4AF37',
                                            display: 'flex',
                                            justifyContent: 'space-between', // Pushes title left and FPS right
                                            alignItems: 'center'
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                            {game.title}
                                        </Typography>

                                        {/* FPS and Settings display */}
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                                                {game.estimatedFps.high} FPS
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#aaa', display: 'block' }}>
                                                (High)
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            )}
        </Box>
    );
};

export default Benchmark;