import { Constant } from './../../../helpers/constant/constant';
import { CustomMobileQuery, HeaderService } from './../../../services/header/header.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VimeoService } from 'src/app/services/vimeo/vimeo.service';


@Component({
  selector: "app-private-video",
  templateUrl: "./private-video.component.html",
  styleUrls: ["./private-video.component.scss"],
})
export class PrivateVideoComponent implements OnInit {
  public controllerDocumentaryComponent: any;
  privateVideos = [];
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
  folder = "01-Sign-Hub Documentary";
  subtitles: any[] = [];
  metadataKey: any;
  subtitlesName: any;
  embedCode: any;
  constructor(
    private headerService: HeaderService,
    private cdRef: ChangeDetectorRef,
    private vimeoService: VimeoService
  ) {
    this.privateVideos = [];
    this.customMobileQuery = this.headerService.retrieveMobileQueryObject(
      cdRef
    );
  }

  ngOnInit() {
    this.headerService.checkPage('archive-isl');
    this.vimeoService.geAllVideos().subscribe((data: any) => {
      if (data) {
        for (const video of data.data) {
          if (video.name.indexOf('-ISL-') > -1) {
            this.privateVideos.push(video);
          }
        }
        this.goToVideoDetails(0);
      }
    });

  }


  getEmbeddedCode(video) {
    /* this.embedCode = video.embed.html; */
    this.videoName = video.name;
    const videoLink = video.link;
    const videoId = videoLink.substring(
      videoLink.lastIndexOf("/") + 1,
      videoLink.length
    );
    this.videoSrc = "https://player.vimeo.com/video/" + videoId;
  }

  goToVideoDetails(index) {
    this.getEmbeddedCode(this.privateVideos[index]);
  }
}
