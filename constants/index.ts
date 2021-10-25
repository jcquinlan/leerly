export enum UserLevels {
    A1 = 'a1',
    A2 = 'a2',
    B1 = 'b1',
    B2 = 'b2',
    C1 = 'c1',
    C2 = 'c2',
}

export enum WordDifficulties {
    SUPER_BEGINNER = 'super-beginner',
    BEGINNER = 'beginner',
    BEGINNER_INTERMEDIATE = 'beginner-intermediate',
    INTERMEDIATE = 'intermediate',
    INTERMEDIATE_ADVANCED = 'intermediate-advanced',
    ADVANCED = 'advanced',
}

export enum WordDifficultiesDisplay {
    SUPER_BEGINNER = 'Super Beginner',
    BEGINNER = 'Beginner',
    BEGINNER_INTERMEDIATE = 'Beginner Intermediate',
    INTERMEDIATE = 'Intermediate',
    INTERMEDIATE_ADVANCED = 'Intermediate Advanced',
    ADVANCED = 'Advanced'
}

export const mapUserLevelToWordDifficulty = (userLevel: UserLevels, display?: boolean): WordDifficulties | WordDifficultiesDisplay => {
    switch (userLevel) {
        case UserLevels.A1:
            return display ? WordDifficultiesDisplay.SUPER_BEGINNER : WordDifficulties.SUPER_BEGINNER;
        case UserLevels.A2:
            return display ? WordDifficultiesDisplay.BEGINNER : WordDifficulties.BEGINNER;
        case UserLevels.B1:
            return display ? WordDifficultiesDisplay.BEGINNER_INTERMEDIATE : WordDifficulties.BEGINNER_INTERMEDIATE;
        case UserLevels.B2:
            return display ? WordDifficultiesDisplay.INTERMEDIATE : WordDifficulties.INTERMEDIATE;
        case UserLevels.C1:
            return display ? WordDifficultiesDisplay.INTERMEDIATE_ADVANCED : WordDifficulties.INTERMEDIATE_ADVANCED;
        case UserLevels.C2:
            return display ? WordDifficultiesDisplay.ADVANCED : WordDifficulties.ADVANCED;
    }
}

// The number of times a user needs to see a word before it's "completed".
export const WORD_COMPLETION_NUMBER = 20;

// Because each difficulty level has vastly different numbers of words
// we can't expect the user to actually complete 100% of the words in each
// so we vary how many of the words a user needs to complete in order to be
// done with their category.
export const DifficultyLevelCompletionPercentages = {
    [UserLevels.A1]: .8,
    [UserLevels.A2]: .5,
    [UserLevels.B1]: .4,
    [UserLevels.B2]: .3,
    [UserLevels.C1]: .25,
    [UserLevels.C2]: .2,
}
