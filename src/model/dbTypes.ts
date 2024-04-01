import { WordType, type Stage } from '../types';

export interface WordsTable {
  word: string;
  lang: string;
  frequencyOrder: number | null;
  audioLink: string | null;
  stage: Stage;
  types: WordType[];
  synonyms: string[];
  definitions: string[];
  examples: string[];
}
type WordsRequiedProps = Omit<
  WordsTable,
  'audioLink' | 'types' | 'synonyms' | 'definitions' | 'examples'
>;
export interface WordsCreate extends WordsRequiedProps {
  audioLink?: string | null;
  types?: WordType[];
  synonyms?: string[];
  definitions?: string[];
  examples?: string[];
}

export interface TranslationsTable {
  word: string;
  srcLang: string;
  destLang: string;
  translations: { type: WordType, translations: string[] }[];
}

export interface WordLogsTable {
  word: string;
  lang: string;
  stage: string;
  date: string;
}

export interface Database {
  word: WordsTable;
  translation: TranslationsTable;
  wordLog: WordLogsTable;
}
