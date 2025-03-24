export class Todo {
  constructor(
    public id: number,
    public title: string,
    public completed: boolean = false
  ) {}

  toggleCompleted?(): void {
    this.completed = !this.completed;
  }
}
