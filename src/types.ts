export const stagesMap = {
    f: 'fresh',
    v: 'viewed',
    m: 'memorized',
    r: 'revision',
} as const;

export type Stage = (typeof stagesMap)[keyof typeof stagesMap];