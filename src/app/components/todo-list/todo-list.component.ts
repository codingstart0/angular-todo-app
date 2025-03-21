import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  todoForm: FormGroup;

  constructor(private todoService: TodoService) {
    this.todoForm = new FormGroup({
      title: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.todos = data;
    });
  }

  addTodo(): void {
    const newTodo = new Todo(
      // TODO: generate id using UUID
      this.todos.length + 1,
      this.todoForm.value.title,
      false
    );

    this.todos.push(newTodo);

    this.todoForm.reset();
  }
}
