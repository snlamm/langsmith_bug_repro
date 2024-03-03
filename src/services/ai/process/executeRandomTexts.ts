import {
  CallbackManager,
  CallbackManagerForToolRun,
} from '@langchain/core/callbacks/manager';
import { StringOutputParser } from '@langchain/core/dist/output_parsers';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

const template = `Print out the following paragraph exactly:

Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. The writer has no idea what topic the random paragraph will be about when it appears. This forces the writer to use creativity to complete one of three common writing challenges. The writer can use the paragraph as the first one of a short story and build upon it. A second option is to use the random paragraph somewhere in a short story they create. The third option is to have the random paragraph be the ending paragraph in a short story. No matter which of these challenges is undertaken, the writer is forced to use creativity to incorporate the paragraph into their writing.

A random paragraph can also be an excellent way for a writer to tackle writers' block. Writing block can often happen due to being stuck with a current project that the writer is trying to complete. By inserting a completely random paragraph from which to begin, it can take down some of the issues that may have been causing the writers' block in the first place.

Now here's a random word: {randomWord}`;

export const createRandomTexts = async ({
  randomWord,
  count,
  callbackManager,
}: {
  randomWord: string;
  count: number;
  callbackManager: CallbackManagerForToolRun;
}) => {
  const messages = [HumanMessagePromptTemplate.fromTemplate(template)];
  const prompt = ChatPromptTemplate.fromMessages(messages);
  const llm = new ChatOpenAI({
    streaming: true,
    modelName: 'gpt-3.5-turbo',
    temperature: 0.4,
    maxTokens: 1000,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const chain = prompt
    .pipe(llm.withConfig({ runName: `(${count}) Create Random Text` }))
    .pipe(new StringOutputParser())
    .withConfig({
      runName: `(${count}) Sequence - Create Random Text`,
      callbacks: [callbackManager],
    });

  const output = await chain.invoke({ randomWord });
  return output;
};
