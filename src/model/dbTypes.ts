import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable
} from 'kysely'

export interface WordTable {
  word: string;
  lang: string;
  audioLink: string | null;
  frequency: number | null;
  stage: 'fresh' | 'viewed' | 'memorized' | 'revision';
  types:
  JSONColumnType<(
    | 'N'        // Noun
    | 'V'        // Verb
    | 'ADJ'      // Adjective
    | 'ADV'      // Adverb
    | 'PRON'     // Pronoun
    | 'PREP'     // Preposition
    | 'CONJ'     // Conjunction
    | 'ART'      // Article
    | 'DET'      // Determiner
    | 'INTJ'     // Interjection
    | 'NUM'      // Numeral
    | 'PART'     // Particle
    | 'AUX'      // Auxiliary
    | 'MOD'      // Modal
    | 'SCONJ'    // Subordinating Conjunction
    | 'CCONJ'    // Coordinating Conjunction
    | 'SYM'     // Symbol
  )[]>;
  synonyms: JSONColumnType<string[]>;
  definitions: JSONColumnType<string[]>;
  examples: JSONColumnType<string[]>;
}
export type Word = Selectable<WordTable>
export type NewWord = Insertable<WordTable>
export type WordUpdate = Updateable<WordTable>

export interface TranslationTable {
  word: string;
  srcLang: string,
  destLang: string,
  translations: JSONColumnType<string[]>;
}
export type Translation = Selectable<TranslationTable>
export type NewTranslation = Insertable<TranslationTable>
export type TranslationUpdate = Updateable<TranslationTable>

export interface WordLogTable {
  word: string;
  lang: string,
  stage: string,
  date: ColumnType<Date, string, never>;
}
export type WordLog = Selectable<WordLogTable>
export type NewWordLog = Insertable<WordLogTable>
export type WordLogUpdate = Updateable<WordLogTable>

export interface Database {
  word: WordTable;
  translation: TranslationTable;
  wordLog: WordLogTable;
}