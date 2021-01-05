import { Injectable } from '@angular/core';
import { Constant } from 'src/app/helpers/constant/constant';
import { RequestService } from '../requests/request.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElementsService {
  workspaces: string = Constant.workspaces;
  workspacesKey: string = Constant.workspacesAlias;
  alias: string = Constant.getAlias();
  root = Constant.root;

  constructor(private requestService: RequestService) { }

  getKey() {
    return this.requestService.getRequest(this.workspacesKey);
  }

  getElementsToDisplay(language) {
    // tslint:disable-next-line:max-line-length
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Videos compressed for streaming/');
  }

  getElementByName(language, name) {
    // tslint:disable-next-line:max-line-length
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Videos compressed for streaming/' + name);
  }

  getElementByKey(key) {
    return this.requestService.getRequestContent('key/' + key);
  }

  getSubtitles(language) {
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Subtitles/');
  }



  getSubtitleDocumentary(language) {
    // tslint:disable-next-line:max-line-length
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Subtitles/Subtitles for local versions/');
  }

  getSubtitleByVideoDocumentary(language, name) {
    // tslint:disable-next-line:max-line-length
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Subtitles/Subtitles for local versions/' + name);
  }

  getSubtitleByVideo(language, name) {
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=/' + language + '/Subtitles/' + name);
  }

  getSubtitle(path) {
    return this.requestService.getRequest(this.workspacesKey + '/elements?root=' + this.root + '&path=' + path);
  }

  getSubtitleStream(url) {
    const headers = new HttpHeaders();
    headers.set('Accept', 'text/vtt');
    return this.requestService.getRawRequest(url, { headers: headers });
  }


  // return cmdi by key
  getMetadata(key) {
    return this.requestService.getRequestContent('key/' + key);
  }

  searchMetadata(value: string) {
    // tslint:disable-next-line:max-line-length
    return this.requestService.getRequest('search/metadata?name=cmdi&streamContent.CMD.Components.SL-TLA.Project.Name*=SIGN-HUB&size=20&streamContent.CMD.Components.SL-TLA.SL-Content.descriptions.Description*=' + value);
  }

  getSpecificFieldInCmdi(keyOfCmdi: string, keyOfJsonInCmdi: string) {
    this.getMetadata(keyOfCmdi).subscribe((cmdi: any) => {
      const CMD = cmdi.CMD;
      const ret = CMD[keyOfJsonInCmdi];
      const json = JSON.parse(ret);
      console.log(json);
      return json;
    });
  }


  // getThumb(key){
  //   return this.requestService.getRequest('thumbs/' + key);
  // }
}
