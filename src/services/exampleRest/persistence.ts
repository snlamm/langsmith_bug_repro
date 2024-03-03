import { EXAMPLE_RESULTS } from './constants.js';

export const getAllExampleItems = (): Array<string> => {
  return EXAMPLE_RESULTS;
};

export const showExampleItem = ({ index }: { index: number }) => {
  return EXAMPLE_RESULTS[index];
};

export const addExampleItem = ({ newItem }: { newItem: number }): void => {
  EXAMPLE_RESULTS.push(newItem.toString());
};

export const updateExampleItem = ({
  newItem,
  index,
}: {
  newItem: string;
  index: number;
}): void => {
  EXAMPLE_RESULTS[index] = newItem;
};
