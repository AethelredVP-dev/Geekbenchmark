import { Box, Typography } from '@mui/material';
import { FadeLoader } from "react-spinners";

const Loader = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#D4AF37' }}>
                Benchmarking in progress...
            </Typography>
            <FadeLoader color="#D4AF37" />
        </Box>
    );
};

export default Loader;