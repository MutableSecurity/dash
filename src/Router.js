import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RequireActiveSession } from './controllers/auth';
import Dash from './pages/Dash';
import Login from './pages/Login';

import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/700.css';
import theme from './styling/theme';

function Router() {
    return (
        <ChakraProvider theme={theme}>
            <BrowserRouter>
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
                        path="/architecture"
                        element={
                            <RequireActiveSession>
                                <Dash architecture />
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/agents/:agentID"
                        element={
                            <RequireActiveSession>
                                <Dash agent />
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/agents/:agentID/solutions/:solutionID"
                        element={
                            <RequireActiveSession>
                                <Dash solution />
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <RequireActiveSession>
                                <Dash settings />
                            </RequireActiveSession>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default Router;
