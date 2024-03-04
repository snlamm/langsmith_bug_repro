import { ChatOpenAI } from '@langchain/openai';
import { traceAsGroup } from '@langchain/core/callbacks/manager';
import { Client } from 'langsmith';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';
import { makeId } from './utils/makeId.js';

const getLangsmithClient = () => {
  return new Client({
    apiKey: process.env.LANGCHAIN_API_KEY,
  });
};

export const runAllPrompts = async () => {
  try {
    const shortId = `testShortId:${makeId(5)}`;

    console.log(`starting! ShortId ${shortId}`);

    const chatLLM = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.4,
      maxTokens: 500,
      openAIApiKey: process.env.OPENAI_API_KEY,
      tags: [shortId],
    });

    // SUCCEEDS------------
    const result = await chatLLM.invoke("Say the word 'test'", {
      runName: 'Log Test - Succeeds',
      tags: [shortId],
      // must pass in a callback handler *with* an array, otherwise an error is shown
      callbacks: [
        new LangChainTracer({
          client: getLangsmithClient(),
          projectName: process.env.LANGSMITH_PROJECT_NAME,
        }),
      ],
    });
    console.log('first result!', result);
    // ------------

    await traceAsGroup(
      {
        name: `Trace Group ${Date.now()}`,
        client: getLangsmithClient(),
        projectName: process.env.LANGSMITH_PROJECT_NAME,
      },
      async (callbackManager) => {
        // FAIL ------------
        const result2 = await chatLLM.invoke("Say the word 'test'", {
          runName: 'Log Test - Hangs',
          tags: [shortId],
          // passes a callback manager in an array. No error is shown/thrown, but the langsmith log will always show as PENDING
          callbacks: [callbackManager],
        });
        // the result console.logs correctly
        console.log('second result!', result2);
        // ------------

        // SUCCEEDS------------
        const result3 = await chatLLM.invoke("Say the word 'test'", {
          runName: 'Log Test - Succeeds',
          tags: [shortId],
          // to succeed, must pass in a callback manager *without* an array
          callbacks: callbackManager,
        });
        console.log('third result!', result3);
        // ------------
      },
    );
  } catch (error) {
    console.log('error!');
    console.log(error);
  }
};
