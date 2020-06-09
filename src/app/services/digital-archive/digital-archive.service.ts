import { Constant } from './../../helpers/constant/constant';
import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';

@Injectable({
  providedIn: 'root'
})
export class DigitalArchiveService {

  constructor(private requestService: RequestService) { }

  getVideoByMeatadata(metadata) {
    return this.requestService.getRequest('search/metadata?' + metadata);
    // https://demo-repo.ortolang.fr/api/search/metadata?name=oai_dc&streamContent.format.value=mp4
  }
}
