import { Profile } from './profile.model';
import { Statement } from './statement.model';

export class Weight {
    public id: number;
    public weightIfTrue: number;
    public weightIfFalse: number;
    public ProfileId: number;
    public StatementId: number;
    public Profile: Profile;
    public Statement: Statement;
}
