import {Injectable} from '@angular/core';

@Injectable()
export class LocalStorageService {

  constructor() {
  }

  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public setObject(key: string, value: any) {
    this.set(key, JSON.stringify(value));
  }

  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  public getObject<T>(key: string): T | null {
    const value = this.get(key);
    if (value == null) {
      return null;
    }
    return JSON.parse(value);
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }
}
