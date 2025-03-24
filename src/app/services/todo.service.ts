import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../interfaces/todo.interface';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private apiBaseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiBaseUrl}/todos`);
  }

  addTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiBaseUrl}/todos`, todo);
  }

  toggleTodo(todo: Todo): Observable<Todo> {
    return this.http.patch<Todo>(`${this.apiBaseUrl}/todos/${todo.id}`, {
      completed: !todo.completed,
    });
  }

  // TODO add other methods like, patch, delete,
}
