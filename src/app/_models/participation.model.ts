import { Chapter } from './chapter.model';

export class Participation {
    public token: string;
    public currentChapterId: number;
    public finished: boolean;
    public currentChapter: Chapter;
}