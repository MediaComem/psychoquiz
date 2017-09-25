import { Chapter } from './chapter.model';
import { Profile } from './profile.model';
import { Weight } from './weight.model';

export class Statement {
    public id: number;
    public text: string;
    public createdAt: Date;
    public updatedAt: Date;
    public ChapterId: number;
    public Chapter: Chapter;
    public Profiles: Profile[];
}
