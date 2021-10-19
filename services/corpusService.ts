import {UserLevels, WordDifficulties} from "../constants";

export const mapUserLevelToWordDifficulty = (userLevel: UserLevels): WordDifficulties => {
    switch (userLevel) {
        case UserLevels.A1:
            return WordDifficulties.SUPER_BEGINNER;
        case UserLevels.A2:
            return WordDifficulties.BEGINNER;
        case UserLevels.B1:
            return WordDifficulties.BEGINNER_INTERMEDIATE;
        case UserLevels.B2:
            return WordDifficulties.INTERMEDIATE;
        case UserLevels.C1:
            return WordDifficulties.INTERMEDIATE_ADVANCED;
        case UserLevels.C2:
            return WordDifficulties.ADVANCED;
    }
}

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
