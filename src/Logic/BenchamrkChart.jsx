'use client'

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';

const BenchmarkChart = ({ userSelection }) => {
    const { report } = useSelector((state) => state.benchmark);
    const theme = useTheme();

    // Extract selected hardware specs safely
    const selectedHardware = userSelection || {
        cpu: report?.systemReport?.cpu || { title: "CPU", score: 50 },
        gpu: report?.systemReport?.gpu || { title: "GPU", score: 50 },
        ram: report?.systemReport?.ram || { title: "RAM", score: 50 },
        'Disk-Space': report?.systemReport?.['Disk-Space'] || { title: "Storage", score: 50 },
        motherboard: report?.systemReport?.motherboard || { title: "Motherboard", score: 50 },
        monitor: report?.systemReport?.monitor || { title: "Monitor", score: 50 },
    };

    // Hardware components data aligned with SpecCards icons
    const chartData = [
        { component: 'CPU', score: selectedHardware?.cpu?.score || 0, name: selectedHardware?.cpu?.title || 'CPU', color: '#D4AF37' },
        { component: 'GPU', score: selectedHardware?.gpu?.score || 0, name: selectedHardware?.gpu?.title || 'GPU', color: '#4CAF50' },
        { component: 'RAM', score: selectedHardware?.ram?.score || 0, name: selectedHardware?.ram?.title || 'RAM', color: '#00BCD4' },
        { component: 'Storage', score: selectedHardware?.['Disk-Space']?.score || 0, name: selectedHardware?.['Disk-Space']?.title || 'Storage', color: '#FF9800' },
        { component: 'Motherboard', score: selectedHardware?.motherboard?.score || 0, name: selectedHardware?.motherboard?.title || 'Motherboard', color: '#9C27B0' },
        { component: 'Monitor', score: selectedHardware?.monitor?.score || 0, name: selectedHardware?.monitor?.title || 'Monitor', color: '#E91E63' },
    ];

    return (
        <Paper
            elevation={3}
            sx={{
                width: '100%',
                p: 3,
                borderRadius: 2,
                mb: 3,
                bgcolor: 'background.paper',
                color: 'text.primary',
                border: '1px solid',
                borderColor: 'primary.main', // Gold theme border
                boxSizing: 'border-box'
            }}
        >
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main', textAlign: "center" }}>
                Hardware Benchmark Breakdown
            </Typography>

            <Box sx={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={chartData} margin={{ left: 10, right: 30, top: 10, bottom: 10 }}>
                        {/* Golden theme  */}
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.mode === 'dark' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(212, 175, 55, 0.25)'} horizontal={false} />

                        {/* Horizontal score axis */}
                        <XAxis
                            type="number"
                            domain={[0, 100]}
                            tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                            stroke={theme.palette.primary.main}
                        />

                        {/* Vertical components axis */}
                        <YAxis
                            type="category"
                            dataKey="component"
                            width={100}
                            tick={{ fill: theme.palette.text.primary, fontSize: 13, fontWeight: 500 }}
                            stroke={theme.palette.primary.main}
                        />

                        {/* Interactive Tooltip matching the MUI Paper background */}
                        <Tooltip
                            cursor={{ fill: 'rgba(212, 175, 55, 0.08)' }}
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                borderRadius: '8px',
                                boxShadow: theme.shadows[4]
                            }}
                            itemStyle={{ color: theme.palette.primary.main }}
                            formatter={(value, name, props) => [`Score: ${value}`, props.payload.name]}
                        />

                        {/* Bars with hardware spec colors */}
                        <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={18}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Paper>
    );
};

export default BenchmarkChart;