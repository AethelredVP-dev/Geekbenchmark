import { Alert, Box, Typography } from '@mui/material';
import { useContext } from 'react';
import { GrGamepad } from 'react-icons/gr';
import { useSelector } from 'react-redux';


const BenchmarkHeader = ({ price }) => {
    const { report } = useSelector(state => state.benchmark);
    return (
        <>
            <Box sx={{ bgcolor: 'background.default', color: "text.primary", p: 3, borderRadius: 2, mb: 2, textAlign: 'center' }}>
                <Typography variant='h4' sx={{ mb: 1 }}>
                    Overall Score: {report.systemReport.overallScore}
                </Typography>
                <Typography variant='h5' sx={{ color: report.systemReport.tier.color }}>
                    System Tier: {report.systemReport.tier.label}
                </Typography>
                <Typography variant='h4' color="primary" sx={{ mt: 1 }}>
                    Total Price: ${price.toLocaleString()}
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
        </>
    )
}
export default BenchmarkHeader