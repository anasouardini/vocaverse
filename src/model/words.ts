import db from './db';
import { type Stage } from '../types';
import { WordsCreate, WordsTable } from './dbTypes';

function create(word: WordsCreate) {
    const statement = db.prepare(`insert into words
    (word, lang, audioLink, frequencyOrder, stage, types, synonyms, definitions, examples)
    values ($word, $lang, $audioLink, $frequencyOrder, $stage, $types, $synonyms, $definitions, $examples);`);

    try {
        statement.run({
            word: word.word,
            lang: word.lang,
            audioLink: word.audioLink ?? '',
            frequencyOrder: word.frequencyOrder,
            stage: word.stage,
            types: JSON.stringify(word.types ?? ['']),
            synonyms: JSON.stringify(word.synonyms ?? ['']),
            definitions: JSON.stringify(word.definitions ?? ['']),
            examples: JSON.stringify(word.examples ?? ['']),
        });
    } catch (err) {
        //* sqlite client is not good with TS
        // @ts-ignore
        if (!err.code.includes('SQLITE_CONSTRAINT_PRIMARYKEY')) {
            throw err;
        }
    }
}

interface UpdateParams {
    word: {
        word: string;
        lang: string;
        stage: Stage;
    };
    newWord: {
        stage: Stage;
    };
}

function update({ word, newWord }: UpdateParams) {
    // update word's stage
    {
        const statement = db.prepare(
            `update words set stage = $stage where word = $word and lang = $lang;`,
        );
        const resp = statement.run({
            word: word.word,
            lang: word.lang,
            stage: newWord.stage,
        });
        if (resp.changes == 0) {
            console.log(`Err -> coudn't update word:`, word);
            return;
        }
    }

    // add log
    {
        const statement = db.prepare(
            `insert into wordLogs (word, lang, stage, date) values ($word, $lang, $stage, $date);`,
        );
        const log = {
            word: word.word,
            lang: word.lang,
            stage: newWord.stage,
            date: new Date().toISOString(),
        };
        const resp = statement.run(log);

        if (resp.changes == 0) {
            console.log(`Err -> coudn't insert log:`, log);
            return;
        }
    }

    return true;
}

export default { update, create };
