import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {

  public languageFormControl: FormControl;

  constructor(private languageService: LanguageService) {
  }

  ngOnInit() {
    this.languageFormControl = new FormControl(this.languageService.getLanguage());

    this.languageFormControl.valueChanges
      .subscribe(language => {
        this.languageService.setLanguage(language);
      });
  }

}
