import { ColorModeScript } from '@chakra-ui/react';
import React, { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';

import App from './App';

import './styling/index.css';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
    <StrictMode>
        <ColorModeScript />
        <App />
    </StrictMode>
);

serviceWorker.unregister();
reportWebVitals();
