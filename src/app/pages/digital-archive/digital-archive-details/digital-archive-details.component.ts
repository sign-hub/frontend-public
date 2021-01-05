import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { ActivatedRoute, Router, NavigationEnd, Params, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Constant } from 'src/app/helpers/constant/constant';
import { ElementsService } from 'src/app/services/elements/elements.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

declare var require: any;
const FileSaver = require('file-saver');

@Component({
  selector: 'app-digital-archive-details',
  templateUrl: './digital-archive-details.component.html',
  styleUrls: ['./digital-archive-details.component.scss']
})
export class DigitalArchiveDetailsComponent implements OnInit {

  // private state$: Observable<object>;
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
  folder: any;
  subtitles: any[] = [];
  subscriptionRefresh: any;
  metadataKey: any;
  listOfKeywords: any;
  slActorSigner: any;
  dataOfTheVideo: any;
  location: any;
  iframeVimeo: any;
  nameOfVideo: any;
  constructor(
    private navService: NavService,
    private route: ActivatedRoute,
    private elementService: ElementsService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private http: HttpClient
  ) {

  }

  ngOnInit() {
    /* this.getVimeoVideo(); */
    this.route.queryParams.subscribe((params: Params) => {
      if (params.name && params.folder) {
        this.videoName = params.name;
        this.folder = params.folder;
      }
    });
    this.navService.checkPage(true);
    /* this.navService.shareLatestVideo.subscribe(latestVideos => {
      this.latestVideos = latestVideos;
    }); */
    const retrievedVideo = localStorage.getItem('latest');
    this.latestVideos = JSON.parse(retrievedVideo);
    this.getVideoByName();
    this.navService.triggerContent.subscribe(data => {
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
        this.videoName = data;
        this.getVideoByName();
      }
    });
  }

  downloadFile(url, filename) {
    const videoUrl = url;
    const videoName = filename;
    FileSaver.saveAs(videoUrl, videoName);
  }


  getVideoByName() {
    this.videoSrc = null;
    this.elementService.getElementByName(this.folder, this.videoName).subscribe(
      res => {
        this.videos = res;
        this.videoSrc = this.baseUrl + this.baseUrlContent + 'key/' + this.videos.key;
        this.originalName = this.videos.name;
        this.authorName = this.videos.author;
        this.description = this.videos.description;
        this.pubblicationdate = this.videos.creation;
        this.fileSize = this.formatFileSize(this.videos.size, 2);
        this.videoFormat = this.videos.mimeType;
        this.getMetadatasByVideo(this.folder, this.videoName);

      },
      error => {
        console.log('error', error);
        this.isEmpty = true;
      }
    );



    /*  let subtitleName = this.videoName.substr(0, this.videoName.lastIndexOf('.'));
     subtitleName += '.vtt';
     console.log(subtitleName); */

    this.getSubtitlesByMetadata(this.folder, this.videoName);
    /* this.elementService.getSubtitle(this.folder, subtitleName).subscribe(
      res => {

        this.subtitles = [];
        this.subtitles.push({
          label: 'Subtitle',
          value: '/ortolang/' + res['key']
        });
        console.log(this.subtitles);

        // this.elementService.getSubtitleStream('/ortolang/' + res['key'])
        // .subscribe(res => {
        //   //console.log('subtitle', res);
        //   this.subtitles = [];
        //  let subt = '';
        //  subt += res;
        //  var subBlob = new Blob([subt]);
        //   var subURL = URL.createObjectURL(subBlob);

        //   this.subtitles.push({
        //     label: 'Subtitle',
        //     value: this.sanitization.bypassSecurityTrustUrl(subURL)
        //   })
        // },
        // error => {
        //   console.log(error);
        // })



        // res['elements'].map(value => {
        //   if (value.mimeType == "text/vtt") {
        // this.subtitles.push({
        //   label: 'Subtitle',
        //   value: this.baseUrl + this.baseUrlContent + 'key/' + res['key']
        // })
        //   }
        // });
      },
      error => {
        console.log(error);
      }
    ); */

  }

  getSubtitlesByMetadata(folder, videoName) {
    this.elementService.getElementByName(folder, videoName).subscribe((responseVideoDetail: any) => {
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
        this.elementService.getMetadata(this.metadataKey).subscribe((response: any) => {
          let x: any;
          let y: any;
          let z: any;
          this.subtitles = [];
          for (x of response.CMD.Components['SL-TLA']['SL-Resources']) {
            for (y of x['SL-AnnotationDocument']) {
              for (z of response.CMD.Resources.ResourceProxyList.ResourceProxy) {
                if (y.ref === z.id && z.ResourceType.mimetype === 'text/vtt') {
                  this.elementService.getSubtitle(z.ResourceRef).subscribe((responseSub: any) => {
                    const source = responseSub;
                    const vttName = source.pathParts[2];
                    const sourceLang = vttName.substring(vttName.lastIndexOf('_') + 1, vttName.length - 4);
                    this.subtitles.push({
                      label: sourceLang,
                      src: '/ortolang/' + source.key,
                      srclang: sourceLang
                    });
                    console.log(this.subtitles);
                  });
                }
              }
            }
          }
          this.video = document.getElementById('video');
          for (const vid of this.video.textTracks) {
            vid.mode = 'hidden';
          }
        });
      } else {
        console.log('Metadata key doesn\'t exist');
      }
    },
      error => {
        console.log('error', error);
      });
  }


  playVideo(videoName) {
    this.videoName = videoName;
    this.getVideoByName();
  }


  formatFileSize(bytes, decimalPoint) {
    if (bytes === 0) { return '0 Bytes'; }
    const k = 1000;
    const dm = decimalPoint || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  getMetadatasByVideo(folder, videoName) {
    this.elementService.getElementByName(folder, videoName).subscribe((responseVideoDetail: any) => {
      const metadatas = responseVideoDetail.metadatas; // metadatas: [ { name, key },...... ]
      let key: any;
      for (const metadata of metadatas) {
        if (metadata.name !== undefined && metadata.name !== null) {
          if (metadata.name === 'cmdi') {
            if (metadata.key !== undefined && metadata.key !== null) {
              key = metadata.key;
            }
          }
        }
      }
      this.elementService.getMetadata(key).subscribe((response: any) => {

        const keywordsList = response.CMD.Components['SL-TLA']['SL-Content'].descriptions.Description;
        this.listOfKeywords = keywordsList.join(', ');
        this.slActorSigner = response.CMD.Components['SL-TLA']['SL-ActorSigner'][0].ActorLanguages.ActorLanguage.Language.LanguageName;
        this.dataOfTheVideo = response.CMD.Components['SL-TLA']['SL-Session'].Date;
        this.location = response.CMD.Components['SL-TLA'].Location.Country.Code;
        /* this.nameOfVideo = response.CMD.Components["SL-TLA"].Project.Title; */
        /* let x: any;
        let y: any;
        let z: any;
        for (x of response.CMD.Components['SL-TLA']['SL-Content']) {
          for (y of x['SL-AnnotationDocument']) {
            for (z of response.CMD.Resources.ResourceProxyList.ResourceProxy) {
              if (y.ref === z.id && z.ResourceType.mimetype === 'text/vtt') {
                console.log(z.ResourceRef);
              }
            }
          }
        } */
      });
    });

  }


  // 27e7511803e84c7666b8ca85f88417d8

  /* getVimeoVideo() {
    this.http.get('https://api.vimeo.com/videos/479784596',
      { headers: { 'Content-type': 'application/json', Authorization: 'Bearer 27e7511803e84c7666b8ca85f88417d8' } })
        .subscribe((data: any) => {
        this.iframeVimeo = data.embed.html;
    });
  } */

  // get all videos
 /*  getVimeoVideo() {
    this.http.get('https://api.vimeo.com/users/127241823/videos',
      { headers: { 'Content-type': 'application/json', Authorization: 'Bearer 27e7511803e84c7666b8ca85f88417d8' } })
        .subscribe((data: any) => {
        this.iframeVimeo = data.data[0].pictures.sizes[3].link_with_play_button;
    });
  } */
}
