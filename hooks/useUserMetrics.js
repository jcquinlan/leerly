import {useState, useEffect, useContext} from 'react';
import {getUserMetrics} from '../services/articleService';
import AppContext from '../contexts/appContext';

const useUserMetrics = () => {
    const {user} = useContext(AppContext);
    const [userMetrics, setUserMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            getUserMetrics(user.uid)
                .then(userMetricsRef => {
                    const userMetricsData = userMetricsRef.data();
                    setUserMetrics(userMetricsData);
                })
                .catch(err => {
                    setError(err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [user]);

    return {
        timeListening: userMetrics && userMetrics.time_listening ? userMetrics.time_listening : 0,
        cardsStudied: userMetrics && userMetrics.cards_studied ? userMetrics.cards_studied : 0,
        loading,
        error
    }
}

export default useUserMetrics;
