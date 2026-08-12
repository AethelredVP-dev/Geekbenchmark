import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { runUltimateBenchmark } from '../Logic/ultimateBenchamrk';
import { createSelection } from '../helpers/formattedObject';
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setError, setGames, setReport } from "../features/Slices/benchmarkSlice";

export const useBenchmark = () => {
    const location = useLocation();
    const userSelection = location.state?.userSelection;

    const dispatch = useDispatch()
    const { report, loading, error, games } = useSelector(state => state.benchmark)

    useEffect(() => {
        let cancelled = false;

        const prepareBenchmark = async () => {

            try {
                dispatch(setLoading(true));
                // Fetch the games database from public folder
                const response = await fetch('/data/games.json');
                if (!response.ok) {
                    throw new Error(`Failed to load games data: ${response.status}`);
                }
                const fetchedGames = await response.json();

                if (!cancelled) {
                    dispatch(setGames(fetchedGames))
                }

                const formattedSelection = createSelection(userSelection);
                const finalResult = runUltimateBenchmark(formattedSelection, fetchedGames);

                if (!cancelled) dispatch(setReport(finalResult));
            } catch (err) {
                console.error('Benchmark failed:', err);
                if (!cancelled) {
                    dispatch(setReport({ error: 'Failed to load games data. Please refresh the page.' }));
                }
            } finally {
                if (!cancelled) dispatch(setLoading(false));
            }
        };

        prepareBenchmark();

        return () => {
            cancelled = true;
        };
    }, [userSelection]);

    return { userSelection };
};