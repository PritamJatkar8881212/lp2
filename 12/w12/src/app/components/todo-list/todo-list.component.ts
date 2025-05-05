import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  editingTodo: Todo | null = null;
  editTitle: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoService.getTodos().subscribe(todos => {
      this.todos = todos;
    });
  }

  addTodo(): void {
    if (this.newTodoTitle.trim()) {
      this.todoService.addTodo(this.newTodoTitle.trim());
      this.newTodoTitle = '';
    }
  }

  startEditing(todo: Todo): void {
    this.editingTodo = todo;
    this.editTitle = todo.title;
  }

  saveEdit(): void {
    if (this.editingTodo && this.editTitle.trim()) {
      this.todoService.updateTodo({
        ...this.editingTodo,
        title: this.editTitle.trim()
      });
      this.cancelEdit();
    }
  }

  cancelEdit(): void {
    this.editingTodo = null;
    this.editTitle = '';
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }

  toggleTodo(id: number): void {
    this.todoService.toggleTodo(id);
  }
} 