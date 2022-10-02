import { ChakraProvider } from '@chakra-ui/react';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { RequireActiveSession } from './controllers/auth';
import Login from './pages/Login';

import '@fontsource/inter/100.css';
import '@fontsource/inter/300.css';
import '@fontsource/inter/700.css';
import { LoadingScreen } from './pages/LoadingScreen';
import theme from './styling/theme';

const Dash = lazy(() => import('./pages/Dash'));

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
                                <Suspense fallback={<LoadingScreen />}>
                                    <Dash overview />
                                </Suspense>
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/architecture"
                        element={
                            <RequireActiveSession>
                                <Suspense fallback={<LoadingScreen />}>
                                    <Dash architecture />
                                </Suspense>
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/agents/:agentID"
                        element={
                            <RequireActiveSession>
                                <Suspense fallback={<LoadingScreen />}>
                                    <Dash agent />
                                </Suspense>
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/agents/:agentID/solutions/:solutionID"
                        element={
                            <RequireActiveSession>
                                <Suspense fallback={<LoadingScreen />}>
                                    <Dash solution />
                                </Suspense>
                            </RequireActiveSession>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <RequireActiveSession>
                                <Suspense fallback={<LoadingScreen />}>
                                    <Dash settings />
                                </Suspense>
                            </RequireActiveSession>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default Router;
