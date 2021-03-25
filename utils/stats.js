const LEVELS = {
    // Level to points
    // 1 article = 1 point
    // 3 mins listening = 1 point
    // 25 vocab cards studied = 1 point

    1: 0,
    2: 5,
    3: 10,
    4: 25,
    5: 50,
    6: 100,
    7: 150,
    8: 250,
    9: 400,
    10: 550,
    11: 800
}
export const calculateStatsLevel = ({minutesListening, cardsReviewed, articlesRead}) => {
    const minutesPoints = Math.floor((minutesListening / 60) / 3);
    const cardsPoints = Math.floor(cardsReviewed / 25);
    const pointSum = articlesRead + minutesPoints + cardsPoints;
    const levels = Object.keys(LEVELS);

    for (let i = 0; i < levels.length; i++) {
        if (i === levels.length - 1) {
            // Max level

            return {
                level: 1,
                percentage: 0
            };
        }

        const low = LEVELS[levels[i]];
        const high = LEVELS[levels[i + 1]];

        if (pointSum >= low && pointSum < high) {
            const floor = pointSum - low;
            const ceiling = high - low;

            return {
                level: i + 1,
                percentage: floor / ceiling
            }
        }
    }

    return {
        level: 1,
        percentage: 0
    };
}