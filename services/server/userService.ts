import { NextApiRequest } from "next";
import {adminAuth, adminFirestore} from '../../services/admin';

export const getUserId = async (req: NextApiRequest) => {
    const leerlyTokenHeader = req.headers['x-leerly-token'] as string;

    if (!leerlyTokenHeader) {
        throw new Error('Token header missing');
    }

    return await adminAuth
        .verifyIdToken(leerlyTokenHeader)
        .then(decodedToken => decodedToken.uid)
        .catch(error => {
            throw error
        });
}

export const getUserProfile = async (req: NextApiRequest) => {
    try {
        const userId = await getUserId(req);
        return await adminFirestore.collection('user_profiles').doc(userId).get();
    } catch (e) {
        throw e;
    }
}

export const isUserAdmin = async (req: NextApiRequest) => {
    try {
        const userId = await getUserId(req);
        const userClaims = await adminFirestore.collection('user_claims').doc(userId).get();

        if (!userClaims.exists) {
            return false;
        }

        return userClaims.data().is_admin;
    } catch (e) {
        throw e;
    }
}