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
}