import { Injectable, Output, EventEmitter } from '@angular/core';
import { RequestService } from '../requests/request.service';
import { Constant } from 'src/app/helpers/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class NavService {

  workspaceUrl: string = Constant.workspaces_alias;
  @Output() detectPage: EventEmitter<any> = new EventEmitter();


  @Output() triggerContent: EventEmitter<any> = new EventEmitter();
  @Output() triggerContentSignLanguage: EventEmitter<any> = new EventEmitter();
  controller: any;
  navbar: any;
  shareLatestVideo = new EventEmitter<any>();

  constructor(private requestService: RequestService) { }

  setCurrentNavBar(navbar) {
    this.navbar = navbar;
  }

  checkPage(value) {
    this.detectPage.emit(value);
  }

  getWorkspaces() {
    return this.requestService.getRequest(this.workspaceUrl + '/sign-hub');
  }

  triggerDetailsContent(value) {
    this.triggerContent.emit(value);
  }


  triggerSignLanguageContent() {
    this.triggerContentSignLanguage.emit();
  }

  setCurrentController(value) {
    this.controller = value;
    if (this.navbar !== undefined || this.navbar !== null) {
      this.navbar.controllerDigitalArchive = this.controller;
    }
  }

  getCurrentController() {
    return this.controller;
  }


  // private data = {};

  // setOption(option, value) {
  //   this.data[option] = value;
  // }

  // getOption() {
  //   return this.data;
  // }
}
