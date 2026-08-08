import { Autocomplete, Container, TextField } from "@mui/material";
import { useContext } from "react";
import { context } from "../../helpers/CONTEXT";

const BenchmarkRankings = () => {
    const { searchItem, setSearchItem, report, setPage, filteredGames } = useContext(context)
    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Autocomplete
                autoComplete
                sx={{ width: '100%', maxWidth: 400, mb: 3, justifyContent: 'center', display: 'flex' }}
                inputValue={searchItem}
                options={report.gameRankings || []}
                onInputChange={(event, newValue) => {
                    setSearchItem(newValue || '');
                    setPage(1);
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