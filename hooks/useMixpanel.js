import mixpanel from 'mixpanel-browser';

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_API_KEY);
const isDevEnv = process.env.NEXT_PUBLIC_ENVIRONMENT === 'development';

const useMixPanel = () => {
    const trackEvent = async (event, metadata = {}) => {
        if (mixpanel && !isDevEnv) {
            const response = await mixpanel.track(event, metadata);
            return response;
        } else {
            console.log('Dev Mixpanel Event Info:');
            console.log(`Event: ${event}`);
            console.log(`Metadata: ${JSON.stringify(metadata)}`);
            console.log(`------------------------------`);
        }
    };

    return {
        trackEvent
    }
}

export default useMixPanel;