// components/PagedGamesList.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Box, Pagination } from '@mui/material';
import GameCard from '../GamesCard';
import { context } from '../../helpers/CONTEXT';

const BenchmarkPagination = () => {
    const itemsPerPage = 6; // Adjust this number based on how many games you want per page
    const { page, setPage, filteredGames } = useContext(context)


    if (!filteredGames || filteredGames.length === 0) return null;

    //Slcing and pagination logic(not that impoortant but still)
    const indexOfLastGame = page * itemsPerPage;
    const indexOfFirstGame = indexOfLastGame - itemsPerPage;
    const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
    const totalPages = Math.ceil(filteredGames.length / itemsPerPage);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Each page renders its own games data */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, width: '100%' }}>
                {currentGames.map((game) => (
                    <GameCard key={game.id} game={game} />
                ))}
            </Box>

            {/* 🎛️ Render Pagination controls right here */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        size="large"
                    />
                </Box>
            )}
        </Box>
    );
};

export default BenchmarkPagination;