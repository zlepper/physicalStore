import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

const LOCALSTORAGE_LANGUAGE_KEY = 'language';

@Injectable()
export class LanguageService {

  private currentLanguage = 'en';

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    this.setLanguage(this.loadLanguageFromStorage());
  }

  /**
   * Sets the application langauge
   * @param {string} language
   */
  public setLanguage(language: string) {
    localStorage.setItem(LOCALSTORAGE_LANGUAGE_KEY, language);
    this.translate.use(language);
    this.currentLanguage = language;
  }

  public getLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Attemts to load the language from the local storage.
   * If no language is available, then 'en' for english will
   * be returned
   * @returns {string}
   */
  private loadLanguageFromStorage(): string {
    return localStorage.getItem(LOCALSTORAGE_LANGUAGE_KEY) || 'en';
  }
}
