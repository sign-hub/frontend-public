import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationGrammarToolService {

  controller: any;
  // navBar: any;


  setCurrentController(value) {
    this.controller = value;
    /*  if (this.navBar !== undefined || this.navBar !== null) {
       this.navBar.controllerGrammarFeauture = this.controller;
     } */
  }

  getCurrentController() {
    return this.controller;
  }

  grammarFeatures = new EventEmitter();

  deleteFeatures = new EventEmitter();

  featureSelected = new EventEmitter();

  featureRetrieved = new EventEmitter();

  coord = new EventEmitter();

  constructor() { }
}
