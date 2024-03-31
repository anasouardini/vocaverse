import db from './db';

export async function read({ word, lang }: { word: string; lang: string }) {
  return await db
    .selectFrom('translations')
    .selectAll()
    .where('word', '=', word)
    .where('srcLang', '=', lang)
    .executeTakeFirstOrThrow();
}
