export class Question {
  constructor(
    public id: number,
    public label: string,
    public subtitle: string,
    public imageUrl: string,
    public possibilites: Array < string > ,
    private answer: number
  ) {};
}
