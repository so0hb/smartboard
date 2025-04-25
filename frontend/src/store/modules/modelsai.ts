export function initStateModelsAI(): API.ModelAI {
    return {

        companyId: '',
        name: '',
        modelCode: '',
        description: '',
        isActivate: true,
        version: '',
        inputData: ["Text"],
        outputData: ["Text"],
        maxTokens: 512,
        temperature: 0.7,
        topP: 0.7,
        topK: 50,
        repetitionPenalty: 1,
        stop: ["[/INST],</s>"],
        stream: true,

        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
}



import { createBaseStore } from './baseStore';

const tableName = 'ai_model';


export const useModelStore = createBaseStore<API.ModelAI>(tableName, initStateModelsAI);
