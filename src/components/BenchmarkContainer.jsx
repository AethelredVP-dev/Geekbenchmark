'use client'

import { useEffect, useMemo } from 'react';
import { Box, Alert } from '@mui/material';
import Loader from '../helpers/Loader';
import { Helmet } from 'react-helmet-async';
import { Footer, Header, Pagination, Rankings } from "./Benchmark"
import BenchmarkChart from "../Logic/BenchamrkChart"
import { useBenchmark } from '../helpers/useBenchmark';
import { useDispatch, useSelector } from 'react-redux';
import { setFilteredGames } from '../store/Slices/benchmarkSlice';


const BenchmarkContainer = () => {


    const { searchItem, report, loading, error } = useSelector(state => state.benchmark);
    const dispatch = useDispatch();

    const { userSelection } = useBenchmark();
    const totalPrice = Object.values(userSelection).reduce(
        (sum, part) => sum + (part?.price ?? 0),
        0
    );

    const filteredGames = useMemo(() => {
        if (!report?.gameRankings) return [];
        return report.gameRankings.filter(game =>
            game.title.toLowerCase().includes(searchItem.toLowerCase())
        );
    }, [report?.gameRankings, searchItem]);
    useEffect(() => {
        dispatch(setFilteredGames(filteredGames));
    }, [filteredGames, setFilteredGames]);

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


                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, width: '100%', boxSizing: 'border-box' }}>
                    {report?.error && (
                        <Alert severity="info" sx={{ mb: 2 }}>{report.error}</Alert>
                    )}
                    <Helmet>
                        <title>Geek Benchmarker - Results</title>
                    </Helmet>

                    {report && !report.error && (
                        <Box sx={{ width: '100%', px: 3 }}>
                            {/* Score Overview Section */}
                            <BenchmarkChart userSelection={userSelection} />

                            {/* Header */}


                            <Header price={totalPrice} />


                            {/* game rankings */}

                            <Rankings />

                            <Pagination />
                        </Box>
                    )}
                    {/* Benchmark Footer */}
                    <Footer />
                </Box>
            )}
        </Box>
    );
};

export default BenchmarkContainer;