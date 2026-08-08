import { useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { context } from "./CONTEXT";
import { runUltimateBenchmark } from '../Logic/ultimateBenchamrk';
import { createSelection } from '../helpers/formattedObject';

export const useBenchmark = () => {
    const location = useLocation();
    const userSelection = location.state?.userSelection;

    const { setGamesData, setReport, setLoading } = useContext(context);

    useEffect(() => {
        let cancelled = false;

        const prepareBenchmark = async () => {
            setLoading(true);
            try {
                // Fetch the games database from public folder
                const response = await fetch('/data/games.json');
                if (!response.ok) {
                    throw new Error(`Failed to load games data: ${response.status}`);
                }
                const fetchedGames = await response.json();

                // Store in context so other components can use it
                if (!cancelled) {
                    setGamesData(fetchedGames);
                }

                const formattedSelection = createSelection(userSelection);
                const finalResult = runUltimateBenchmark(formattedSelection, fetchedGames);

                if (!cancelled) setReport(finalResult);
            } catch (err) {
                console.error('Benchmark failed:', err);
                if (!cancelled) {
                    setReport({ error: 'Failed to load games data. Please refresh the page.' });
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        prepareBenchmark();

        return () => {
            cancelled = true;
        };
    }, [userSelection, setGamesData, setReport, setLoading]);

    return { userSelection };
};