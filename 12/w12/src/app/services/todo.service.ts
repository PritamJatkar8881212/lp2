import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from '../models/todo.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private readonly STORAGE_KEY = 'todos';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTodos();
  }

  private loadTodos(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedTodos = localStorage.getItem(this.STORAGE_KEY);
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
        this.todosSubject.next(this.todos);
      }
    }
  }

  private saveTodos(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    }
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string): void {
    const newTodo: Todo = {
      id: Date.now(),
      title,
      completed: false,
      createdAt: new Date()
    };
    this.todos.push(newTodo);
    this.todosSubject.next(this.todos);
    this.saveTodos();
  }

  updateTodo(todo: Todo): void {
    const index = this.todos.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      this.todos[index] = todo;
      this.todosSubject.next(this.todos);
      this.saveTodos();
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(todo => todo.id !== id);
    this.todosSubject.next(this.todos);
    this.saveTodos();
  }

  toggleTodo(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.todosSubject.next(this.todos);
      this.saveTodos();
    }
  }
} 