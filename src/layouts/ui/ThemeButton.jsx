import { Box, Button } from "@mui/material"
import { useContext } from "react";
import { CiDark } from "react-icons/ci";
import { MdOutlineLightMode } from "react-icons/md";
import { context } from "../../helpers/CONTEXT";



const ThemeButton = () => {
    const { darkMode, setDarkMode } = useContext(context);
    return (

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
            <Button
                variant="outlined"
                color="primary"
                onClick={() => setDarkMode(!darkMode)}
                sx={{ minWidth: '48px', height: '48px' }}
            >
                {darkMode ? <MdOutlineLightMode size={20} /> : <CiDark size={20} />}
            </Button>
        </Box>
    )
}
export default ThemeButton