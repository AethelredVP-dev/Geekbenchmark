'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { lightTheme, darkTheme } from '@/ui/theme';
import { useSelector } from 'react-redux';

function Themed({ children }) {
    const { darkMode } = useSelector((state) => state.benchmark);
    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}

export default function Providers({ children }) {
    return (
        <AppRouterCacheProvider>
            <Provider store={store}>
                <Themed>{children}</Themed>
            </Provider>
        </AppRouterCacheProvider>
    );
}