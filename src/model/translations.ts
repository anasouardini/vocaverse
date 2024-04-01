import db from './db';
import { type Lang, LangShort, TranslationOutput } from '../types';

interface ReadParams {
  stage: string;
  srcLang: LangShort;
  destLang: LangShort;
}
function read({
  stage,
  srcLang,
  destLang,
}: ReadParams): TranslationOutput[] | undefined {
  const statement = db.prepare(`
    select T.translations, W.* from translations T inner join words W
      on T.word = W.word and T.srcLang = W.lang
      where W.stage = $stage and T.srcLang = $srcLang
      and T.destLang = $destLang
  `);

  const resp = statement.all({ stage, srcLang, destLang });
  if (!resp) {
    console.log(`Err -> stage '${stage}' or lang '${srcLang}' doesn't exist`);
    return undefined;
  }

  return resp as TranslationOutput[];
}

export default { read };
