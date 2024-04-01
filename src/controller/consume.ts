import { TranslationOutput, type Stage } from '../types';
import fs, { promises as fsp } from 'fs';
import path from 'path';
import translationsM from '../model/translations';
import wordsM from '../model/words';
const prompt = require('prompt-sync')();

interface Args {
  language: 'fr' | 'en';
  strategy: 'start' | 'random' | string;
  stage: Stage;
}

const args = process.argv.slice(2);
const config: Args = {
  // @ts-ignore
  language: args[0] ?? 'fr',
  strategy: args[1] ?? 'start',
  // @ts-ignore
  stage: args[2] ?? 'fresh',
};

// select target word
function SelectTargetWord(
  filteredWordsList: TranslationOutput[],
  lastIndex: number,
) {
  let selectedWord: TranslationOutput;
  let index: number;
  if (config.strategy == 'random') {
    index = Math.floor(Math.random() * filteredWordsList.length);
    selectedWord = filteredWordsList[index];
  } else if (config.strategy == 'start') {
    index = lastIndex + 1;
    if (index >= filteredWordsList.length) {
      index = 0;
    }
    selectedWord = filteredWordsList[index];
  } else if (parseInt(config.strategy)) {
    index = parseInt(config.strategy);
    selectedWord = filteredWordsList[index];
  } else {
    // start is the default strategy
    index = lastIndex + 1;
    if (index >= filteredWordsList.length) {
      index = 0;
    }
    selectedWord = filteredWordsList[index];
  }

  return { selectedWord, index };
}

function displayDefinition(
  selectedTranslation: TranslationOutput,
  order: string,
) {
  type Action = TranslationOutput['stage'];
  const definition = `${order}) ${selectedTranslation.word} (${selectedTranslation.types.join(', ')}): ${selectedTranslation.synonyms.join(', ')}`;
  console.log(definition);

  if (selectedTranslation.stage == 'fresh') {
    wordsM.update({
      word: {
        word: selectedTranslation.word,
        lang: selectedTranslation.lang,
        stage: selectedTranslation.stage,
      },
      newWord: {
        stage: 'viewed',
      },
    });
  }
}

// prompt user for action
function promptUser(selectedTranslation: TranslationOutput) {
  const options = ['Quit [q]', 'Dismiss [default]'];
  if (
    selectedTranslation.stage == 'fresh' ||
    selectedTranslation.stage == 'viewed' ||
    selectedTranslation.stage == 'revision'
  ) {
    options.push('memorized (m)');
  } else if (selectedTranslation.stage == 'memorized') {
    options.push('Revision (r)');
  }

  let newStage =
    (prompt(`\x1b[33m${options.join(' | ')} > \x1b[0m`) as string) ||
    selectedTranslation.stage;
  if (newStage == 'q') {
    process.exit(0);
  }

  // @ts-ignore
  newStage = newStage.length == 1 ? stagesMap[newStage] : newStage;
  // @ts-ignore
  if (!Object.values(stagesMap).includes(newStage)) {
    console.log(`Err -> stage '${newStage}' doesn't exist`);
    process.exit(1);
  }

  // @ts-ignore
  return newStage as TranslationOutput['stage'];
}

interface Args {
  language: 'fr' | 'en';
  strategy: 'start' | 'random' | string;
  stage: Stage;
}
export default function consume(args: Args) {
  const filteredWordsList = translationsM.read({
    stage: args.stage,
    srcLang: config.language,
    destLang: 'en',
  });
  if (!filteredWordsList) {
    return;
  }
  let lastIndex = -1;
  while (true) {
    const { selectedWord: selectedTranslation, index } = SelectTargetWord(
      filteredWordsList,
      lastIndex,
    );
    lastIndex = index;
    displayDefinition(
      selectedTranslation,
      `${index + 1}/${filteredWordsList.length}`,
    );
    const newStage = promptUser(selectedTranslation);

    // update
    const resp = wordsM.update({
      word: {
        word: selectedTranslation.word,
        lang: selectedTranslation.lang,
        stage: selectedTranslation.stage,
      },
      newWord: {
        stage: newStage,
      },
    });
    if (!resp) {
      return;
    }
  }
}
