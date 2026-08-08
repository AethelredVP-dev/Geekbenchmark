import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

const BenchmarkFooter = () => {
    const navigate = useNavigate()
    return (
        <>
            <Button type='button' variant="contained" color="primary" onClick={() => navigate("/")} sx={{ mt: 3 }}>
                Select Specs Again
            </Button>
        </>
    )
}
export default BenchmarkFooter