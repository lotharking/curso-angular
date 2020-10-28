import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  login(user: string, password: string): boolean {
    if (user === 'user' && password === 'password'){
      localStorage.setItem('username', user);//localStorage- persiste valor en el navegador(component html5)
      return true;
    }
    return false;
  }

  logout(): any {
    localStorage.removeItem('username');
  }

  getUser(): any {//busca el username
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {//valida si el username es distinto de null
    return this.getUser() !== null;
  }
}
