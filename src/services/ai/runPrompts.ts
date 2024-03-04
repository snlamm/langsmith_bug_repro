import { ChatOpenAI } from '@langchain/openai';
import { Callbacks, traceAsGroup } from '@langchain/core/callbacks/manager';
import { Client } from 'langsmith';
import { LangChainTracer } from '@langchain/core/tracers/tracer_langchain';
import { makeId } from './utils/makeId.js';
import {
  BaseCallbackHandler,
  CallbackHandlerMethods,
} from '@langchain/core/dist/callbacks/base.js';

const getLangsmithClient = () => {
  return new Client({
    apiKey: process.env.LANGCHAIN_API_KEY,
  });
};

const createLog = async ({
  name,
  shortId,
  callbacks,
}: {
  name: string;
  shortId: string;
  callbacks: Callbacks;
}) => {
  const chatLLM = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0.4,
    maxTokens: 500,
    openAIApiKey: process.env.OPENAI_API_KEY,
    tags: [shortId],
  });
  const result = await chatLLM.invoke("Say the word 'test'", {
    runName: `Log Test - ${name}`,
    tags: [shortId],
    callbacks,
  });

  return result;
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
          // issue is placing the callback manager in an array
          callbacks: [callbackManager],
        });
        // the result console.logs, but the langsmith log always shows as PENDING
        console.log('second result!', result2);
        // ------------

        // SUCCEEDS------------
        const result3 = await chatLLM.invoke("Say the word 'test'", {
          runName: 'Log Test - Succeeds',
          tags: [shortId],
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
