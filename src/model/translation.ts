import db from './db';
import { Translation, TranslationUpdate, NewTranslation } from './dbTypes';

export async function read({ word, lang }: { word: string, lang: string }) {
    return await db
        .selectFrom('translation')
        .selectAll()
        .where('word', '=', word)
        .where('srcLang', '=', lang)
        .executeTakeFirstOrThrow();
}