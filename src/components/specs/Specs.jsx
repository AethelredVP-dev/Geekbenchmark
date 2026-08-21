import axios from 'axios';
import React, { useEffect } from 'react';
import { LuCpu, LuMonitor, LuCircuitBoard, LuHardDrive } from "react-icons/lu";
import { FaMemory } from "react-icons/fa6";
import { BsPciCard } from "react-icons/bs";
import { validation } from '@/helpers/VALIDATION';
import { Formik, Form } from 'formik';
import { Container, Button, Grid } from '@mui/material';
import SpecCard from './SpecCards';
import Presets from '@/components/Presets';
import { useDispatch, useSelector } from 'react-redux';
import { setSpecs, setLoading } from '@/store/benchmarkSlice';


const Specs = () => {
    const { specs } = useSelector(state => state.benchmark);
    const dispatch = useDispatch();

    useEffect(() => {
        const URL = "https://6a5a5e97ad8332e75f027284.mockapi.io/api/v1/all/1";

        const fetchData = async (url) => {
            try {
                const { data, status } = await axios.get(url);
                if (status === 200) {
                    dispatch(setSpecs({
                        cpu: data.cpu || [],
                        gpu: data.gpu || [],
                        ram: data.ram || [],
                        monitor: data.monitor || [],
                        motherboard: data.motherboard || [],
                        'Disk-Space': data['Disk-Space'] || []
                    }))
                }
            } catch (err) {
                console.error("Error fetching data:", err);
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

        dispatch(setLoading(true));
        navigate("/benchmark", { state: { userSelection } });
    };

    const specFields = [
        { name: 'cpu', label: 'CPU', icon: <LuCpu size={24} style={{ color: "#D4AF37" }} /> },
        { name: 'gpu', label: 'GPU', icon: <BsPciCard size={24} style={{ color: '#4CAF50' }} /> },
        { name: 'ram', label: 'RAM', icon: <FaMemory size={24} style={{ color: '#00BCD4' }} /> },
        { name: 'monitor', label: 'Monitor', icon: <LuMonitor size={24} style={{ color: '#E91E63' }} /> },
        { name: 'motherboard', label: 'Motherboard', icon: <LuCircuitBoard size={24} style={{ color: '#9C27B0' }} /> },
        { name: 'Disk-Space', label: 'Storage', icon: <LuHardDrive size={24} style={{ color: '#FF9800' }} /> }
    ];

    return (
        <Container>

            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validation}>
                {({ setFieldValue, setFieldTouched, values, errors: formikErrors, touched: formikTouched }) => (
                    <Form>
                        <Grid container spacing={3}>
                            {specFields.map((field) => (
                                <Grid key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                                    <SpecCard
                                        name={field.name}
                                        title={field.label || field.name.toUpperCase()}
                                        icon={field.icon}
                                        options={specs[field.name]}
                                        values={values}
                                        errors={formikErrors}
                                        touched={formikTouched}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
                            <Button type="submit" variant='contained' color='primary'>Benchmark</Button>
                        </div>
                    </Form>
                )}
            </Formik>
            <Presets db={specs} />
        </Container>
    );
};

export default Specs;