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
