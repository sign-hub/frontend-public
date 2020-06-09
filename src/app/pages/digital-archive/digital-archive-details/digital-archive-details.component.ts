import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavService } from "src/app/services/navigation-streaming-tool/nav.service";
import { ActivatedRouteSnapshot, ActivatedRoute, Router, NavigationStart } from "@angular/router";
import { map, filter } from "rxjs/operators";
import { Observable, BehaviorSubject } from "rxjs";
import { Constant } from "src/app/helpers/constant/constant";
import { ElementsService } from "src/app/services/elements/elements.service";

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: "app-digital-archive-details",
  templateUrl: "./digital-archive-details.component.html",
  styleUrls: ["./digital-archive-details.component.scss"]
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
  isEmpty: boolean = false;
  metadata: any;
  pubblicationdate: any;
  latestVideos: any = [];
  constructor(
    private navService: NavService,
    private route: ActivatedRoute,
    private elementService: ElementsService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) {
    this.videoName = this.route.snapshot.paramMap.get("name");
  }

  ngOnInit() {
    this.navService.checkPage(true);
    /* this.navService.shareLatestVideo.subscribe(latestVideos => {
      this.latestVideos = latestVideos;
    }); */
    let retrievedVideo = localStorage.getItem('latest');
    this.latestVideos = JSON.parse(retrievedVideo);
    this.getVideoByName();
    this.navService.triggerContent.subscribe(data => {
      if (!this.cdRef["destroyed"]) {
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
    let key = localStorage.getItem('key');
    this.elementService.getElementByName(key, this.videoName).subscribe(
      res => {
        console.log("result", res)
        this.videos = res;
        this.videoSrc = this.baseUrl + this.baseUrlContent + "key/" + this.videos.key;
        this.originalName = this.videos.name;
        this.authorName = this.videos.author;
        this.description = this.videos.description;
        this.pubblicationdate = this.videos.creation;
        this.fileSize = this.formatFileSize(this.videos.size, 2);
        this.videoFormat = this.videos.mimeType;

      },
      error => {
        console.log("error", error);
        this.isEmpty = true;
      }
    );
  }

  playVideo(videoName) {
    this.videoName = videoName;
    this.getVideoByName();
  }



  formatFileSize(bytes, decimalPoint) {
    if (bytes == 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
