export const gameModesSchemas = {
    // OW - Order Word
    OW: {
        type: "object",
        properties: {
            id_Category: { type: "integer", title: "Category ID" },
            word: { type: "string", title: "Word" },
            hint1: { type: "string", title: "Hint 1" },
            hint2: { type: "string", title: "Hint 2" },
            hint3: { type: "string", title: "Hint 3" }
        }
    },
    // MC - Multiple Choice
    MC: {
        type: "object",
        properties: {
            id_Category: { type: "integer", title: "Category ID" },
            hint1: { type: "string", title: "Hint 1" },
            hint2: { type: "string", title: "Hint 2" },
            hint3: { type: "string", title: "Hint 3" },
            randomWord1: { type: "string", title: "Random Word 1" },
            randomWord2: { type: "string", title: "Random Word 2" },
            randomWord3: { type: "string", title: "Random Word 3" },
            randomCorrectWord: { type: "string", title: "Random Correct Word" },
            question: { type: "string", title: "Question" }
        }
    },
    // GP - Guess Phrase
    GP: {
        type: "object",
        properties: {
            id_Category: { type: "integer", title: "Category ID" },
            phrase: { type: "string", title: "Phrase" },
            correctWord: { type: "string", title: "Correct Word" },
            hint1: { type: "string", title: "Hint 1" },
            hint2: { type: "string", title: "Hint 2" },
            hint3: { type: "string", title: "Hint 3" }
        }
    }
};

export const editCategorySchema = {
    category : {
        type: "object",
        properties: {
            name: {type:"string", title:"Name"},
            //urlIcon: {type:"string", title:"URL Icon"},
            description: {type:"string", title:"Description"}
        }
    }
}