import { Card, CardContent, Box, Typography, Autocomplete, TextField } from '@mui/material';

const SpecCard = ({
    name,
    title,
    icon,
    options,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched
}) => {
    const isError = touched[name] && Boolean(errors[name]);
    return (
        <Card variant='elevation' sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <Typography variant='h5'>{title}</Typography>
                </Box>
                <Autocomplete
                    options={options || []}
                    getOptionLabel={option => option?.title || ""}
                    value={options?.find(item => item.id === values[name]) || null}
                    onChange={(e, newValue) => {
                        setFieldValue(name, newValue ? newValue.id : '');
                        setFieldTouched(name, true, false);
                    }}
                    onBlur={() => setFieldTouched(name, true)}
                    slotProps={{
                        listbox: {
                            sx: {
                                maxHeight: '200px',
                                scrollbarWidth: 'none',
                                '&::-webkit-scrollbar': {
                                    display: 'none',
                                },
                            },
                        },
                    }}
                    renderInput={props => (
                        <TextField
                            {...props}
                            error={isError}
                            helperText={isError ? errors[name] : ''}
                            label={`Select ${title}`}
                            variant="outlined"
                        />
                    )}
                />
            </CardContent>
        </Card>
    );
};

export default SpecCard;