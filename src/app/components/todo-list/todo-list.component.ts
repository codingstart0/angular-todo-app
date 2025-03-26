import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
import { FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  newTodoForm: FormGroup;
  todosFormGroup: FormGroup;
  todosFormArray: FormArray<FormGroup>;

  constructor(private todoService: TodoService) {
    this.newTodoForm = new FormGroup({
      title: new FormControl(''),
    });
    this.todosFormGroup = new FormGroup({
      todos: new FormArray([]),
    });
    this.todosFormArray = this.todosFormGroup.get('todos') as FormArray;
  }

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((todos) => {
      this.buildTodosForm(todos);
    });
  }

  buildTodosForm(todos: Todo[]) {
    this.todosFormArray.clear();

    todos.forEach((todo) => {
      this.addTodoToFormArray(todo);
    });
  }

  addTodoToFormArray(todo: Todo) {
    this.todosFormArray.push(
      new FormGroup({
        id: new FormControl(todo.id),
        title: new FormControl(todo.title),
        completed: new FormControl(todo.completed),
      })
    );
  }

  addTodo(): void {
    const newTodo: Omit<Todo, 'id'> = {
      title: this.newTodoForm.value.title,
      completed: false,
    };

    this.todoService.addTodo(newTodo).subscribe((savedTodo) => {
      this.addTodoToFormArray(savedTodo);
      this.newTodoForm.reset();
    });
  }

  removeTodoFromFormArray(id: number): void {
    const index = this.todosFormArray.controls.findIndex(
      (todoFormGroup) => todoFormGroup.get('id')?.value === id
    );
    if (index !== -1) {
      this.todosFormArray.removeAt(index);
    }
  }

  onDeleteTodo(id: number): void {
    this.removeTodoFromFormArray(id);
  }

  deleteAllCompleted(): void {
    const completedTodos = this.todosFormArray.controls.filter(
      (todoFormGroup) => todoFormGroup.get('completed')?.value === true
    );

    completedTodos.forEach((todoFormGroup) => {
      const id = todoFormGroup.get('id')?.value;
      if (id !== undefined) {
        this.todoService.removeTodo(id).subscribe(() => {
          this.removeTodoFromFormArray(id);
        });
      }
    });
  }

  hasCompletedTodos(): boolean {
    return this.todosFormArray.controls.some(
      (todoFormGroup) => todoFormGroup.get('completed')?.value === true
    );
  }
}
