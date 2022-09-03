import {
    getAuth,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { LOGIN_CHECK_GRACE_PERIOD } from '../config';
import { app } from './common';

export const auth = getAuth(app);

export function RequireActiveSession({ children }) {
    const [user, setUser] = useState();
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
        }, LOGIN_CHECK_GRACE_PERIOD);
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
