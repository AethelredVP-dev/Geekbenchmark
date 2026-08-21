'use client'

import { Box, Button } from "@mui/material"
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setDarkMode } from "@/store/benchmarkSlice";




const ThemeButton = () => {
    const { darkMode } = useSelector(state => state.benchmark);
    const dispatch = useDispatch();
    return (

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => dispatch(setDarkMode(!darkMode))}
                sx={{ minWidth: '48px', height: '48px' }}
            >
                {darkMode ? <MdOutlineLightMode size={20} /> : <CiDark size={20} />}
            </Button>
        </Box>
    )
}
export default ThemeButton