import fetch from 'node-fetch';
import { languagesMap, type LangShort, type Lang, type WordType } from '../types';

type LingueeResponse = {
    "featured": boolean, //idk
    "text": string,
    "pos": string, // could be adjective, feminine
    "forms": string[],
    "grammar_info": null,// idk
    "audio_links":
    {
        "url": string,
        "lang": string // could be "british english"
    }[],
    "translations": {
        "featured": boolean, //idk
        "text": string,
        "pos": WordType,
        "audio_links": {
            "url": string,
            "lang": string // could be "british english"
        }[];
        "examples": {
            "src": string,
            "dst": string
        }[];
        "usage_frequency": null
    }[]
}[];

interface LookupWord {
    word: string;
    srcLang: LangShort;
    destLang: LangShort;
}
async function lookup({ word, srcLang, destLang }: LookupWord) {
    const dictionary = `https://linguee-api.fly.dev/api/v2/translations?query=${word}&src=${srcLang}&dst=${destLang}`;

    const resp = await fetch(dictionary);
    const translations: LingueeResponse = await resp.json() as LingueeResponse;

    const parsedTranslations = translations.map((translation) => {
        console.log(translation)
        const translationLang = translation.audio_links?.[0]?.lang?.toLowerCase();
        const srcLangLong = languagesMap[srcLang].toLocaleLowerCase();
        if (!translationLang || translationLang?.includes(srcLangLong)) {
            return { type: translation.pos, translations: translation.translations.map((t) => t.text) };
        }
    }).filter((entry) => entry)

    return {
        word,
        srcLang,
        destLang,
        translations: parsedTranslations
    };
}

export default { lookup };