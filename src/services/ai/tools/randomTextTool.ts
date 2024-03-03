import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { createRandomTexts } from '../process/executeRandomTexts';

export const getRandomTextTool = () => {
  return new DynamicStructuredTool({
    name: 'randomText',
    description: 'generate random via an LLM',
    schema: z.object({ randomWord: z.string() }),
    func: async ({ randomWord }, callbackManager) => {
      await createRandomTexts({
        randomWord,
        count: 1,
        callbackManager,
      });
      await createRandomTexts({
        randomWord,
        count: 2,
        callbackManager,
      });
      await createRandomTexts({
        randomWord,
        count: 3,
        callbackManager,
      });
      await createRandomTexts({
        randomWord,
        count: 4,
        callbackManager,
      });
      const result = await createRandomTexts({
        randomWord,
        count: 5,
        callbackManager,
      });

      return result;
    },
  });
};
