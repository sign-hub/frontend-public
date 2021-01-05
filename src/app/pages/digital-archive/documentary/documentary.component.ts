import { Constant } from './../../../helpers/constant/constant';
import { CustomMobileQuery, HeaderService } from './../../../services/header/header.service';

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { ElementsService } from 'src/app/services/elements/elements.service';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/videos/video.service';

@Component({
  selector: 'app-documentary',
  templateUrl: './documentary.component.html',
  styleUrls: ['./documentary.component.scss']
})
export class DocumentaryComponent implements OnInit {
  public controllerDocumentaryComponent: any;
  videosDocumentary = [];
  opened = true;
  customMobileQuery: CustomMobileQuery;
  video: any;
  baseUrl = Constant.baseUrlDemo;
  baseUrlContent = Constant.content;
  aliasUrl = Constant.getAlias();
  videoName: string;
  videos: any = [];
  videoSrc: string;
  videoFormat: string;
  published: string;
  authorName: string;
  description: string;
  fileSize: any;
  originalName: string;
  isEmpty = false;
  metadata: any;
  pubblicationdate: any;
  latestVideos: any = [];
  folder = '01-Sign-Hub Documentary';
  subtitles: any[] = [];
  metadataKey: any;
  subtitlesName: any;
  constructor(
    private headerService: HeaderService,
    private cdRef: ChangeDetectorRef,
    private elementsService: ElementsService
  ) {
    this.videosDocumentary = [];
    this.customMobileQuery = this.headerService.retrieveMobileQueryObject(cdRef);
  }

  ngOnInit() {
    this.headerService.checkPage('documentary');
    this.elementsService.getElementsToDisplay(this.folder).subscribe((response: any) => {
      for (const video of response.elements) {
        if (video.mimeType === 'video/mp4') {
          this.videosDocumentary.push(video);
        }
      }
      this.videoName = this.videosDocumentary[0].name;
      this.getVideoByName(this.videoName);
    });

  }

  getVideoByName(videoName) {
    this.videoSrc = null;
    this.elementsService.getElementByName(this.folder, videoName).subscribe(
      res => {
        this.videos = res;
        this.videoSrc = this.baseUrl + this.baseUrlContent + 'key/' + this.videos.key;
        this.originalName = this.videos.name;
        this.authorName = this.videos.author;
        this.description = this.videos.description;
        this.pubblicationdate = this.videos.creation;
        this.fileSize = this.formatFileSize(this.videos.size, 2);
        this.videoFormat = this.videos.mimeType;
      },
      error => {
        console.log('error', error);
        this.isEmpty = true;
      }
    );

    // this.getSubtitlesByMetadata(this.folder, videoName);
    this.elementsService.getSubtitleDocumentary(this.folder).subscribe((resp: any) => {
      this.subtitlesName = resp.elements;
      this.subtitles = [];
      this.video = document.getElementById('video');
      for (const sub of this.subtitlesName) {
        const vttName = sub.name;
        const sourceLang = vttName.substring(vttName.lastIndexOf('_') + 1, vttName.length - 4);
        this.elementsService.getSubtitleByVideoDocumentary(this.folder, sub.name).subscribe(
          (res: any) => {
            this.subtitles.push({
              label: sourceLang,
              src: '/ortolang/' + res.key,
              srclang: sourceLang
            });
          },
          error => {
            console.log(error);
          });
      }
      if (this.video) {
        for (const vid of this.video.textTracks) {
          vid.mode = 'hidden';
        }
      }
    });

  }

  formatFileSize(bytes, decimalPoint) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1000;
    const dm = decimalPoint || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  goToVideoDetails(index?: number, name?: string) {
    if (name && index == null) {
      this.videoName = name;
      this.getVideoByName(this.videoName);
    } else {
      this.videoName = this.videosDocumentary[index].name;
      this.getVideoByName(this.videoName);
    }
  }

  /*  getSubtitlesByMetadata(folder, videoName) {
     this.elementsService.getElementByName(folder, videoName).subscribe((responseVideoDetail: any) => {
       const metadatas = responseVideoDetail.metadatas; // metadatas: [ { name, key },...... ]
       for (const metadata of metadatas) {
         if (metadata.name !== undefined && metadata.name !== null) {
           if (metadata.name === 'cmdi') {
             if (metadata.key !== undefined && metadata.key !== null) {
               this.metadataKey = metadata.key;
             }
           }
         }
       }
       if (this.metadataKey !== undefined && this.metadataKey !== null) {
         this.elementsService.getMetadata(this.metadataKey).subscribe((response: any) => {
           let x: any;
           let y: any;
           let z: any;
           this.subtitles = [];
           for (x of response.CMD.Components['SL-TLA']['SL-Resources']) {
             for (y of x['SL-AnnotationDocument']) {
               for (z of response.CMD.Resources.ResourceProxyList.ResourceProxy) {
                 if (y.ref === z.id && z.ResourceType.mimetype === 'text/vtt') {
                   this.elementsService.getSubtitle(z.ResourceRef).subscribe((responseSub: any) => {
                     const source = responseSub;
                     const vttName = source.pathParts[2];
                     const sourceLang = vttName.substring(vttName.length - 7, vttName.length - 4);
                     let srcLanguage = '';
                     if (sourceLang !== undefined && sourceLang !== null) {
                       if (sourceLang === 'ENG') {
                         srcLanguage = 'en';
                       } else if (sourceLang === 'SPA') {
                         srcLanguage = 'es';
                       }
                     }
                     this.subtitles.push({
                       label: sourceLang,
                       src: '/ortolang/' + source.key,
                       srclang: srcLanguage
                     });
                     console.log(this.subtitles);
                   });
                 }
               }
             }
           }
         });
       } else {
         console.log('Metadata key doesn\'t exist');
       }
     },
       error => {
         console.log('error', error);
       });
   } */


}
