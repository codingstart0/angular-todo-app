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
}
