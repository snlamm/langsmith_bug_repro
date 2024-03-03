import {
  DynamicStructuredTool,
  DynamicTool,
  Tool,
} from '@langchain/core/tools';
import { z } from 'zod';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { StringOutputParser } from '@langchain/core/dist/output_parsers';

const log = 'Print out some log';

const getRandomOtherTool = () => {
  return new DynamicTool({
    name: 'Some Text Log',
    description: 'Creates a text log',
    func: async () => '',
  });
};

export const createLog = () => {
  const tool = getRandomOtherTool();
};
