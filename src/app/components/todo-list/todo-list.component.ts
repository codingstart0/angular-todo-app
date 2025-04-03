import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../interfaces/todo.interface';
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
    const newTodo: Omit<Todo, 'id'> = {
      title: this.todoForm.value.title,
      completed: false,
    };

    this.todoService.addTodo(newTodo).subscribe((savedTodo) => {
      this.todos.push(savedTodo);
      this.todoForm.reset();
    });
  }

  toggleTodo(todo: Todo): void {
    this.todoService.toggleTodo(todo).subscribe((updatedTodo) => {
      todo.completed = updatedTodo.completed;
    });
  }
}
