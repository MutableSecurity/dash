import {
    getAuth,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { app } from './firebase_controller';

const LOGIN_TIMEOUT = 3000;

export const auth = getAuth(app);

var user = undefined;

export function RequireActiveSession({ children }) {
    const [user, setUser] = useState(null);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(changedUser => {
            if (changedUser) {
                var currentUser = getAuth(app).currentUser;

                if (currentUser) {
                    setUser(currentUser);
                    setReady(true);
                }
            }
        });

        setTimeout(() => {
            setReady(true);
        }, LOGIN_TIMEOUT);
    }, []);

    if (isReady) {
        if (user) {
            return children;
        } else {
            return <Navigate to="/" replace />;
        }
    }
}

export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
export const signOut = firebaseSignOut;
