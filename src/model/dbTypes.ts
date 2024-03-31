export interface WordsTable {
  word: string;
  lang: string;
  audioLink: string | null;
  frequency: number | null;
  stage: 'fresh' | 'viewed' | 'memorized' | 'revision';
  types:
  (
    | 'N' // Noun
    | 'V' // Verb
    | 'ADJ' // Adjective
    | 'ADV' // Adverb
    | 'PRON' // Pronoun
    | 'PREP' // Preposition
    | 'CONJ' // Conjunction
    | 'ART' // Article
    | 'DET' // Determiner
    | 'INTJ' // Interjection
    | 'NUM' // Numeral
    | 'PART' // Particle
    | 'AUX' // Auxiliary
    | 'MOD' // Modal
    | 'SCONJ' // Subordinating Conjunction
    | 'CCONJ' // Coordinating Conjunction
    | 'SYM' // Symbol
  )[];
  synonyms: string[];
  definitions: string[];
  examples: string[];
}

export interface TranslationsTable {
  word: string;
  srcLang: string;
  destLang: string;
  translations: string[];
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