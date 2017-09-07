import { Chapter } from './chapter.model';

export class Participation {
    token: string;
    currentChapterId: number;
    finished: boolean;
    currentChapter: Chapter;
}