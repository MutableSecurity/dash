import {
    getAuth,
    signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { Navigate } from 'react-router-dom';

import { app } from './firebase_controller';

export const auth = getAuth(app);

export function RequireActiveSession({ children }) {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
        return children;
    } else {
        return <Navigate to="/" replace />;
    }
}

export const signInWithEmailAndPassword = firebaseSignInWithEmailAndPassword;
export const signOut = firebaseSignOut;
