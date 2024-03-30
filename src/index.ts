import { Migrator, FileMigrationProvider } from 'kysely'
import { promises as fs } from 'fs'
import path from 'path'
import db from './model/db'

const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: 'backend/database/migrations'
    }),
})

migrator.migrateToLatest();
process.exit(0);

// todo: switch from Deno to Node(ts-node)

const process = Deno;
const __dirname = import.meta.dirname;

interface Args {
    language: 'fr' | 'en',
    category: 'top-100' | 'top-500',
    strategy: 'start' | 'random' | string,
    stage: Stage
}

const args = process.args;
// @ts-ignore
// const args = process.argv.slice(2);
const config: Args = {
    // @ts-ignore
    language: args[0] ?? 'fr',
    // @ts-ignore
    category: args[1] ?? 'top-100',
    strategy: args[2] ?? 'start',
    stage: args[3],
}

const stagesMap = {
    f: 'fresh',
    v: 'viewed',
    m: 'memorized',
    r: 'revision',
} as const

type Stage = typeof stagesMap[keyof typeof stagesMap];
interface Word {
    name: string,
    types: ('adj' | 'noun')[],
    synonyms: string[],
    stage: Stage,
    dates: {
        viewed: string;
        memorized: string;
        revision: string;
    }
}

function read() {
    const fileContent = Deno.readTextFileSync(path.join(__dirname, config.language, `${config.category}.json`));
    if (!fileContent) {
        console.log(`Err -> file does not exist.`)
        process.exit(1);
    }
    if (fileContent.length == 0) {
        console.log(`Err -> file is empty`)
        process.exit(1);
    }
    const wordsList = JSON.parse(fileContent).words;
    const targetStages = config.stage ?? ['fresh', 'viewed', 'revision'];
    const filteredWordsList = wordsList.filter((word: Word) => targetStages.includes(word.stage));
    // console.log(wordsList)
    if (!filteredWordsList.length) {
        console.log(`Err -> words list is empty`)
        process.exit(0);
    }
    return filteredWordsList;
}

// select target word
function SelectTargetWord(filteredWordsList: Word[], lastIndex: number) {
    let selectedWord: Word;
    let index: number;
    if (config.strategy == 'random') {
        index = Math.floor(Math.random() * filteredWordsList.length);
        selectedWord = filteredWordsList[index];
    } else if (config.strategy == 'start') {
        index = lastIndex + 1;
        if (index >= filteredWordsList.length) {
            index = 0
        }
        selectedWord = filteredWordsList[index];
    } else if (parseInt(config.strategy)) {
        index = parseInt(config.strategy);
        selectedWord = filteredWordsList[index];
    } else {
        // start is the default strategy
        index = lastIndex + 1;
        if (index >= filteredWordsList.length) {
            index = 0
        }
        selectedWord = filteredWordsList[index];
    }

    return { selectedWord, index };
}

function displayDefinition(selectedWord: Word, order: string) {
    type Action = Word['stage'];
    const definition = `${order}) ${selectedWord.name} (${selectedWord.types.join(', ')}): ${selectedWord.synonyms.join(', ')}`;
    console.log(definition);
    if (selectedWord.stage == 'fresh') {
        selectedWord.stage = 'viewed';
        selectedWord.dates.viewed = new Date().toISOString();
    }
}

// prompt user for action
function promptUser(selectedWord: Word) {
    const options = ['Quit [q]', 'Dismiss [default]'];
    if (selectedWord.stage == 'fresh' || selectedWord.stage == 'viewed' || selectedWord.stage == 'revision') {
        options.push('memorized (m)');
    } else if (selectedWord.stage == 'memorized') {
        options.push('Revision (r)');
    }

    let newStage = prompt(`\x1b[33m${options.join(' | ')} > \x1b[0m`) as string || selectedWord.stage;
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
    return newStage as Word['stage'];
}

function update(newStage: Word['stage'], selectedWord: Word) {
    // console.log({ newStage });
    // @ts-ignore
    selectedWord.stage = newStage;
    // @ts-ignore
    selectedWord.dates[selectedWord.stage] = new Date().toISOString();
}

function save() {
    const newWordsListString = JSON.stringify({ words: filteredWordsList }, null, ' ');
    // console.log(newWordsListString)

    Deno.writeTextFileSync(path.join(__dirname, config.language, `${config.category}.json`), newWordsListString);
}

const filteredWordsList = read();
let lastIndex = -1;
while (true) {
    const { selectedWord, index } = SelectTargetWord(filteredWordsList, lastIndex);
    lastIndex = index;
    displayDefinition(selectedWord, `${index + 1}/${filteredWordsList.length}`);
    const newStage = promptUser(selectedWord);
    update(newStage, selectedWord);
    save();
}
