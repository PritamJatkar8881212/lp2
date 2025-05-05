import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Check if we're in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem(this.CURRENT_USER_KEY);
      if (storedUser) {
        this.currentUserSubject.next(JSON.parse(storedUser));
      }
    }
  }

  private getUsers(): User[] {
    if (isPlatformBrowser(this.platformId)) {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    }
    return [];
  }

  private saveUsers(users: User[]): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  register(user: User): Observable<User> {
    const users = this.getUsers();
    // Check if user with same email already exists
    if (users.some(u => u.email === user.email)) {
      throw new Error('User with this email already exists');
    }
    
    const newUser = { ...user, id: Date.now() };
    users.push(newUser);
    this.saveUsers(users);
    
    // Set as current user
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(newUser));
    }
    this.currentUserSubject.next(newUser);
    return of(newUser);
  }

  login(email: string, password: string): Observable<User | null> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      }
      this.currentUserSubject.next(user);
      return of(user);
    }
    return of(null);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CURRENT_USER_KEY);
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}
