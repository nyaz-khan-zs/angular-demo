import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}
  getData(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
  setdata(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  removedata(key: string) {
    localStorage.removeItem(key);
  }
  clearLocalStorage() {
    localStorage.clear();
  }
}
