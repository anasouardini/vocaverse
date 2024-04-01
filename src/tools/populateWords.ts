import fs from 'fs';
import path from 'path';
import wordsM from '../model/words';
import { WordsCreate } from '../model/dbTypes';
import { Lang } from '../types';

export default function populate({ lang, path }: { lang: Lang; path: string }) {
    // read file
    const wordsStr = fs.readFileSync(path, 'utf-8');
    const wordsList = wordsStr.split('\n');

    // parse
    for (let wordIndex = 0; wordIndex < wordsList.length; wordIndex++) {
        // const [word, lang] = wordRow.split(',');
        const word = wordsList[wordIndex].trim();
        // console.log({ word });
        // break;

        // insert
        const resp = wordsM.create({
            word,
            lang,
            frequencyOrder: wordIndex,
            stage: 'fresh',
        });
    }
}
