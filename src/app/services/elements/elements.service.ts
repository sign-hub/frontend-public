import { Injectable } from '@angular/core';
import { Constant } from 'src/app/helpers/constant/constant';
import { RequestService } from '../requests/request.service';

@Injectable({
  providedIn: 'root'
})
export class ElementsService {
  workspaces: string = Constant.workspaces;
  workspacesKey: string = Constant.workspaces_alias;
  alias: string = Constant.getAlias();

  constructor(private requestService: RequestService) { }

  getKey() {
    return this.requestService.getRequest(this.workspacesKey + this.alias)
  }
  //apercu
  getElements(key) {
    return this.requestService.getRequest(this.workspaces + key + '/elements?path=/testfolder&root=3');
  }

  getElementByName(key, name) {
    return this.requestService.getRequest(this.workspaces + key + '/elements?root=3&path=/testfolder/' + name);
  }

  getElementByKey(key) {
    return this.requestService.getRequestContent('key/' + key);
  }

  // getMetadata(key){
  //   return this.requestService.getRequestContent('key/' + key);
  // }

  // getThumb(key){
  //   return this.requestService.getRequest('thumbs/' + key);
  // }
}
