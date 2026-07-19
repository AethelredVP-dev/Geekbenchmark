import React, { useEffect, useContext } from 'react';
import { runUltimateBenchmark } from '../benchmark/ultimateBenchamrk';
import { context } from '../helpers/CONTEXT';
import { Box, Typography, Alert, Button } from '@mui/material';
import { GrGamepad } from "react-icons/gr";
import gamesDataImport from '../helpers/games.json';
import { useNavigate, useLocation } from 'react-router-dom';
import ItemsList from './Pagination';
import PagedGamesList from './Pagination';
import Loader from '../helpers/Loader';
import { Helmet } from 'react-helmet-async';

const Benchmark = () => {
    const { gamesData, report, setGamesData, setReport, loading, setLoading } = useContext(context);
    const navigate = useNavigate();
    const location = useLocation();
    const userSelection = location.state?.userSelection; // Receiving state from navigation safely

    useEffect(() => {
        let cancelled = false;

        const prepareBenchmark = async () => {
            const currentGamesData = gamesData.length > 0 ? gamesData : gamesDataImport;

            if (gamesData.length === 0) {
                setGamesData(currentGamesData);
            }

            // Fallback object to ensure the algorithm doesn't break if direct URL navigation occurs
            const formattedSelection = {
                cpu: userSelection?.cpu || { title: "CPU", score: 50 },
                gpu: userSelection?.gpu || { title: "GPU", score: 50 },
                ram: userSelection?.ram || { title: "RAM", score: 50 },
                'Disk-Space': userSelection?.['Disk-Space'] || { title: "Storage", score: 50 },
                motherboard: userSelection?.motherboard || { title: "Motherboard", score: 50 },
                monitor: userSelection?.monitor || { title: "Monitor (1920x1080 - 16:9)", score: 50 }
            };

            // Run core logic via full resolution-based simulator engine
            const finalResult = runUltimateBenchmark(formattedSelection, currentGamesData);
            if (!cancelled) setReport(finalResult);
        };

        prepareBenchmark();

        const timer = setTimeout(() => {
            if (!cancelled) setLoading(false);
        }, 1200);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [userSelection]);

    return (
        <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {loading ? (
                <>
                    <Helmet>
                        <title>Geek Benchmarker - Loading</title>
                    </Helmet>
                    <Loader />
                </>
            ) : (


                <Box sx={{ display: 'flex', flexDirection: 'column', alignParagraphs: 'center', alignItems: 'center', p: 4, width: '100%', boxSizing: 'border-box' }}>
                    {report?.error && (
                        <Alert severity="info" sx={{ mb: 2 }}>{report.error}</Alert>
                    )}
                    <Helmet>
                        <title>Geek Benchmarker - Results</title>
                    </Helmet>

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

                            {/* Compatibility Issues Section */}
                            {!report.systemReport.compatibility.compatible && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {report.systemReport.compatibility.issues.map((issue, i) => (
                                        <div key={i}>{issue}</div>
                                    ))}
                                </Alert>
                            )}

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

                            {/* Game Rankings Responsive Container */}
                            <PagedGamesList games={report.gameRankings} />
                        </Box>
                    )}
                    <Button type='button' variant="contained" color="primary" onClick={() => navigate('/')} sx={{ mt: 3 }}>
                        Select Specs Again
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Benchmark;