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
    // OBD - Order by Date
    OBD: {
        type: "object",
        properties: {
            id_Category: { type: "integer", title: "Category ID" },
            event: { type: "string", title: "Event" },
            infoEvent: { type: "string", title: "Info Event" },
            startDate: {
                type: "object",
                title: "Start Date",
                properties: {
                    anio: { type: "string", title: "Year" },
                    mes: { type: "string", title: "Month" },
                    dia: { type: "string", title: "Day" }
                }
            },
            endDate: {
                type: "object",
                title: "End Date",
                properties: {
                    anio: { type: "string", title: "Year" },
                    mes: { type: "string", title: "Month" },
                    dia: { type: "string", title: "Day" }
                }
            },
            hint1: { type: "string", title: "Hint 1" },
            hint2: { type: "string", title: "Hint 2" },
            hint3: { type: "string", title: "Hint 3" }
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