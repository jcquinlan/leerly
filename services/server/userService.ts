import { NextApiRequest } from "next";
import {adminAuth, adminFirestore} from '../../services/admin';
import firebase from 'firebase-admin'

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

const getUserProfileBatch = async (userIds: string[]) => {
    try {
        return adminFirestore.collection('user_profiles').where(
                firebase.firestore.FieldPath.documentId(),
                'in',
                userIds
            )
            .get();
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const getAuthors = async () => {
    // Get all user claims that contain `is_author`
    const authors = await adminFirestore.collection('user_claims').where('is_author', '==', true).get();

    const authorsCount = authors.docs.length;
    const batchesCount = Math.ceil(authorsCount / 10);
    const userProfilePromises: Promise<FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>[] = [];

    const userIds = Array.from(authors.docs.values()).map((item => item.id));

    // In batches of 10, get all the UserProfile records for the users that are authors
    for (let i = 0; i < batchesCount; i++) {
        const userIdsBatch = userIds.slice(i * 10, (i * 10) + 10 + 1);
        userProfilePromises.push(getUserProfileBatch(userIdsBatch))
    }

    const allProfiles = await Promise.all(userProfilePromises);

    // Peel out only the userIds and the names, then return them.
    const allProfileData = allProfiles
        .map(query => Array.from(query.docs.values())
            .map(item => {
                const data = item.data();

                return {
                    name: data.name,
                    userId: item.id
                }
            })
        )
        .flat();
    
    return allProfileData;
}