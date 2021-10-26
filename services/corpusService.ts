import {UserLevels} from "../constants";

export const getNextDifficultyLevel = (userLevel?: UserLevels): UserLevels => {
    const difficultyKeys = Object.values(UserLevels);

    if (!userLevel) {
        return difficultyKeys[0];
    }

    const indexOfCurrentDifficulty = difficultyKeys.indexOf(userLevel);

    if (indexOfCurrentDifficulty === -1) {
        return difficultyKeys[0];
    }

    if (indexOfCurrentDifficulty === difficultyKeys.length - 1) {
        return difficultyKeys[difficultyKeys.length - 1];
    }

    return difficultyKeys[indexOfCurrentDifficulty + 1];
}
