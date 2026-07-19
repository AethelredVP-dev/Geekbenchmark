import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { LuCpu, LuMonitor, LuCircuitBoard, LuHardDrive } from "react-icons/lu";
import { FaMemory } from "react-icons/fa6";
import { BsPciCard } from "react-icons/bs"
import { validation } from '../helpers/VALIDATION';
import { Formik, Form } from 'formik';
import {
    Container,
    Card,
    CardContent,
    Typography,
    Button,
    Autocomplete,
    TextField,
    Box,
    Icon
} from '@mui/material';
import { context } from '../helpers/CONTEXT';
import { useNavigate } from 'react-router-dom';

const Specs = () => {
    const { specs, setSpecs, setLoading } = useContext(context)
    const navigate = useNavigate()
    useEffect(() => {

        const URL = "https://6a5a5e97ad8332e75f027284.mockapi.io/api/v1/all/1";

        const fetchData = async (url) => {
            try {
                const { data, status } = await axios.get(url);
                if (status === 200) {
                    setSpecs({
                        cpu: data.cpu || [],
                        gpu: data.gpu || [],
                        ram: data.ram || [],
                        monitor: data.monitor || [],
                        motherboard: data.motherboard || [],
                        'Disk-Space': data['Disk-Space'] || []
                    });
                }
            } catch (err) {
                console.log("Error fetching data:", err);
            }
        };

        fetchData(URL);
    }, []);


    const initialValues = {
        cpu: '',
        gpu: '',
        ram: '',
        monitor: '',
        motherboard: '',
        'Disk-Space': ''
    };

    const handleSubmit = (values) => {
        const userSelection = {
            cpu: specs.cpu?.find(item => item.id === values.cpu) || null,
            gpu: specs.gpu?.find(item => item.id === values.gpu) || null,
            ram: specs.ram?.find(item => item.id === values.ram) || null,
            monitor: specs.monitor?.find(item => item.id === values.monitor) || null,
            motherboard: specs.motherboard?.find(item => item.id === values.motherboard) || null,
            'Disk-Space': specs['Disk-Space']?.find(item => item.id === values['Disk-Space']) || null,
        };

        setLoading(true)
        navigate("/benchmark", { state: { userSelection } })
    };
    return (
        <Container sx={{ py: 4 }}>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validation}>
                {({ setFieldValue, setFieldTouched, values, errors: formikErrors, touched: formikTouched }) => (
                    <Form>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '24px',
                            width: '100%'
                        }}>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LuCpu size={24} style={{ color: '#D4AF37' }} />
                                        <Typography variant='h5'>Cpu</Typography>
                                    </Box>
                                    <Autocomplete
                                        fullWidth
                                        options={specs.cpu || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs.cpu?.find(item => item.id === values.cpu) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('cpu', newValue ? newValue.id : '');
                                            setFieldTouched('cpu', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('cpu', true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched.cpu && Boolean(formikErrors.cpu)}
                                                helperText={formikTouched.cpu && formikErrors.cpu}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <BsPciCard size={22} style={{ color: '#4CAF50' }} />
                                        <Typography variant='h5'>GPU</Typography>
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={specs.gpu || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs.gpu?.find(item => item.id === values.gpu) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('gpu', newValue ? newValue.id : '');
                                            setFieldTouched('gpu', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('gpu', true, true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched.gpu && Boolean(formikErrors.gpu)}
                                                helperText={formikTouched.gpu && formikErrors.gpu}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <FaMemory size={20} style={{ color: '#00BCD4' }} />
                                        <Typography variant='h5'>RAM</Typography>
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={specs.ram || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs.ram?.find(item => item.id === values.ram) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('ram', newValue ? newValue.id : '');
                                            setFieldTouched('ram', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('ram', true, true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched.ram && Boolean(formikErrors.ram)}
                                                helperText={formikTouched.ram && formikErrors.ram}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LuMonitor size={22} style={{ color: '#E91E63' }} />
                                        <Typography variant='h5'>Monitor</Typography>
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={specs.monitor || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs.monitor?.find(item => item.id === values.monitor) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('monitor', newValue ? newValue.id : '');
                                            setFieldTouched('monitor', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('monitor', true, true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched.monitor && Boolean(formikErrors.monitor)}
                                                helperText={formikTouched.monitor && formikErrors.monitor}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LuCircuitBoard size={22} style={{ color: '#9C27B0' }} />
                                        <Typography variant='h5'>Motherboard</Typography>
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={specs.motherboard || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs.motherboard?.find(item => item.id === values.motherboard) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('motherboard', newValue ? newValue.id : '');
                                            setFieldTouched('motherboard', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('motherboard', true, true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched.motherboard && Boolean(formikErrors.motherboard)}
                                                helperText={formikTouched.motherboard && formikErrors.motherboard}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                            <Card variant='elevation'>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <LuHardDrive size={22} style={{ color: '#FF9800' }} />
                                        <Typography variant='h5'>Storage</Typography>
                                    </div>
                                    <Autocomplete
                                        fullWidth
                                        options={specs['Disk-Space'] || []}
                                        getOptionLabel={option => option?.title || ""}
                                        value={specs['Disk-Space']?.find(item => item.id === values['Disk-Space']) || null}
                                        onChange={(e, newValue) => {
                                            setFieldValue('Disk-Space', newValue ? newValue.id : '');
                                            setFieldTouched('Disk-Space', true, false);
                                        }}
                                        onBlur={() => setFieldTouched('Disk-Space', true, true)}
                                        renderInput={props => (
                                            <TextField
                                                {...props}
                                                label="Select your component"
                                                error={formikTouched['Disk-Space'] && Boolean(formikErrors['Disk-Space'])}
                                                helperText={formikTouched['Disk-Space'] && formikErrors['Disk-Space']}
                                            />
                                        )}
                                    />
                                </CardContent>
                            </Card>

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                            <Button type="submit" variant='contained' color='primary'>Benchmark</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container >
    );
};

export default Specs;