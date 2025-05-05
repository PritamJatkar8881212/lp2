import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoListComponent } from './components/todo-list/todo-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TodoListComponent],
  template: `
    <div class="app-container">
      <app-todo-list></app-todo-list>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 1rem;
    }
  `]
})
export class AppComponent {
  title = 'w12';
}
