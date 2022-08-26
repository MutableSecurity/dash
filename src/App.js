import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Dash from './pages/Dash/Dash';
import Login from './pages/Login/Login';
import { RequireActiveSession } from './utilities/auth';

import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/700.css';
import theme from './styling/theme';

function App() {
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/overview"
                        element={
                            <RequireActiveSession>
                                <Dash overview />
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/solutions"
                        element={
                            <RequireActiveSession>
                                <Dash solutions />
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <RequireActiveSession>
                                <Dash account />
                            </RequireActiveSession>
                        }
                    />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}

export default App;
