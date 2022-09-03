import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import reportWebVitals from './reportWebVitals';
import Router from './Router';
import * as serviceWorker from './serviceWorker';

import './styling/index.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <StrictMode>
        <ColorModeScript />
        <Router />
    </StrictMode>
);

serviceWorker.unregister();
reportWebVitals();
