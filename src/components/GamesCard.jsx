// components/GamesCard.jsx
import { ToggleButtonGroup, ToggleButton, Typography, Box } from "@mui/material";
import { useState } from 'react';

const GamesCard = ({ game }) => {
    const [selectedQuality, setSelectedQuality] = useState('high'); // Default state set to high

    const handleQualityChange = (event, newQuality) => {
        // Prevent toggle from deselecting completely and returning null
        if (newQuality !== null) {
            setSelectedQuality(newQuality);
        }
    };

    return (
        <Box
            sx={{
                flex: '1 1 calc(33.333% - 16px)',
                minWidth: '250px',
                bgcolor: 'background.paper',
                p: 2,
                borderRadius: 2,
                borderLeft: '4px solid #D4AF37',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
            }}
        >
            <Typography variant='h6' sx={{ mb: 1 }}>
                {game.title}
            </Typography>

            {/* Dynamic rendering linked to user selection */}
            <Typography variant='body2' sx={{ mb: 1, fontWeight: 'bold' }}>
                Estimated FPS: <span style={{ color: '#4CAF50' }}>{game.estimatedFps[selectedQuality]}</span>
            </Typography>

            <ToggleButtonGroup
                exclusive
                value={selectedQuality}
                onChange={handleQualityChange}
                color="primary"
                fullWidth // Fixed capitalization for MUI property
                aria-label="outlined primary button group"
                sx={{ mt: 1 }}
            >
                <ToggleButton value="low">Low</ToggleButton>
                <ToggleButton value="medium">Medium</ToggleButton>
                <ToggleButton value="high">High</ToggleButton>
                <ToggleButton value="ultra">Ultra</ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}

export default GamesCard;