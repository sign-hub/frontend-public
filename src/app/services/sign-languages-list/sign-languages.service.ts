import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { Constant } from 'src/app/helpers/constant/constant';




@Injectable({
  providedIn: 'root'
})
export class SignLanguagesService {

  private languages: any = [];
  private featuresMap: any = [

  ]

  constructor(private http: HttpClient) { }

  private Url: string = Constant.Url;
  private SignhubUrl: string = Constant.SignhubUrl;

  getSignLanguages() {
    return this.http.get(this.Url + 'getSignLanguages');
  }

  getSignLanguageById(uuid: string) {
    return this.http.get(this.Url + 'getSignLanguage?id=' + uuid);
  }

  getLanguageDetail(code: string) {
    return this.http.get(this.Url + 'getSignLanguage?code=' + code);
  }

  getGrammarFeaturesSelected() {
    return this.http.get(this.Url + 'getFeatures');
  }

  getGrammarFeatures() {
    return this.http.get(this.Url + 'getFeaturesMap');
  }

  searchByFeatures(features) {
    return this.http.post(this.SignhubUrl + 'searchByFeatures', features);
  }

  getFeaturesMapByLanguage(code) {
    return this.http.get(this.SignhubUrl + 'getFeaturesMapByLanguage?code=' + code);
  }

  getFeaturesTree() {
    return this.http.get(this.SignhubUrl + 'getFeaturesTree');
  }


}
