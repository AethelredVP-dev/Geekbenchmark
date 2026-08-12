import { Autocomplete, Container, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPage, setSearchItem } from "../../features/Slices/benchmarkSlice";

const BenchmarkRankings = () => {
    const dispatch = useDispatch()
    const { report, searchItem, filteredGames } = useSelector(state => state.benchmark)
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Autocomplete
                autoComplete
                sx={{ width: '100%', maxWidth: 400, mb: 3, justifyContent: 'center', display: 'flex' }}
                inputValue={searchItem}
                options={report.gameRankings || []}
                onInputChange={(event, newValue) => {
                    dispatch(setSearchItem(newValue || ''));
                    dispatch(setPage(1));
                }}

                clearOnBlur={false}
                getOptionLabel={option => option?.title || ""}
                renderInput={params =>
                    <TextField
                        {...params}
                        label="Search Games"
                    />
                }
            />
        </Container>
    )
}
export default BenchmarkRankings