import { Statement } from './statement.model';

export class Chapter {
    public id: number;
    public title: string;
    public intro: string;
    public imgUrl: string;
    public number: number;
    public createdAt: Date;
    public updatedAt: Date;
    public Statements: Statement[];
    public finished: boolean; // hack to be able to redirect when getting a random chapter from the server
}