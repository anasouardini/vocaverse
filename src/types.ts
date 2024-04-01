import { TranslationsTable, type WordsTable } from './model/dbTypes';

export type Stage = 'fresh' | 'viewed' | 'memorized' | 'revision';

export type Lang = 'english' | 'french' | 'spanish';
export type LangShort = 'en' | 'fr' | 'es';
export const languagesMap: Record<LangShort, Lang> = {
  en: 'english',
  fr: 'french',
  es: 'spanish',
};

export type WordType = "pronoun" | "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "interjection" | "article" | "determiner" | "numeral" | "preposition" | "conjunction" | "interjection" | "article" | "determiner" | "numeral";

export interface TranslationOutput extends WordsTable {
  translations: TranslationsTable["translations"];
}
