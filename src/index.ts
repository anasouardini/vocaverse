import controllers from './controller';
import { type Stage } from './types';
import lookup from './tools/lookupTranslation';
import path from 'path';
import populate from './tools/populateWords';
import schema from './model/schema';

(async () => {
  // ------------------- schema
  // schema.update();
  // process.exit(0);

  // ------------------- populate new words
  // populate({ path: path.join('src', 'data', 'en', 'top-5k.txt'), lang: 'en' });
  // populate({ path: path.join('src', 'data', 'fr', 'top-5k.txt'), lang: 'fr' });
  // process.exit(0);

  // ------------------- lookup new words' translations
  const translations = await lookup({ word: 'bon', srcLang: 'fr', destLang: 'en' });
  console.log(translations);
  process.exit(0);

  /*
  const args = process.argv.slice(2);
  type Mode = 'consume';
  const mode: Mode = args[0] as Mode;
  if (mode !== 'consume') {
    process.exit(0);
  }
  
  // dispatcher
  controllers[mode](args.slice(1));
  */
})()