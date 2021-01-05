import { Injectable } from '@angular/core';
import { RequestService } from '../requests/request.service';

@Injectable({
  providedIn: 'root'
})
export class VimeoService {

  constructor(
    private requestService: RequestService
  ) { }

  geAllVideos() {
    return this.requestService.getVimeoRawRequest('https://api.vimeo.com/users/127424428/videos');
  }
}
