import { Chapter } from './chapter.model';

export class Statement {
    public id: number;
    public text: string;
    public createdAt: Date;
    public updatedAt: Date;
    public ChapterId: number;
    public Chapter: Chapter;
}