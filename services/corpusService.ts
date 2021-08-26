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