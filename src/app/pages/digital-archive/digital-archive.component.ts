import { filter } from 'rxjs/operators';
import { element } from 'protractor';
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { HeaderService } from 'src/app/services/header/header.service';
import { ElementsService } from 'src/app/services/elements/elements.service';
import { Constant } from 'src/app/helpers/constant/constant';
import { VideoService } from 'src/app/services/videos/video.service';
import { isNgTemplate } from '@angular/compiler';

@Component({
  selector: 'app-digital-archive',
  templateUrl: './digital-archive.component.html',
  styleUrls: ['./digital-archive.component.scss']
})
export class DigitalArchiveComponent implements OnInit {
  @ViewChild('toggleButton', { static: false }) toggleButton: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;

  toggleDropdown = false;
  displayMode = 1;
  basicUrl = Constant.baseUrlDemo;
  isList = false;
  isGrid = true;
  searchTerm = '';
  filteredData: any = [];
  totalVideos;
  key;
  metadata: any;
  results: any;
  videos: any = [];
  video: any;
  dataResult: any = [];
  thumb: any;
  metadataResults: any;
  keySort = 'name'; // set default
  reverse = false;
  videoName;
  thumbRes: any;
  loading = false;
  originalName: any;

  sortedValue = false; // ascc
  opened = true;
  latestVideos: any = [];
  languages = Constant.language;
  paramsLanguage: boolean;
  folder: any;
  nameDisabled: boolean;
  metadataDisabled: boolean;
  searchName: string;
  videosByMetadata: any = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navService: NavService,
    private headerService: HeaderService,
    private elementService: ElementsService,
    private renderer: Renderer2,
    private videoService: VideoService,
  ) {
    this.navService.setCurrentController(this);
    /**
     * This events get called by all clicks on the page
     */
    this.renderer.listen('window', 'click', (e: Event) => {
      /* if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.menu.nativeElement
      ) {
        this.toggleDropdown = false;
      } */
    });
    // search by name set as default
    this.nameDisabled = true;
    this.metadataDisabled = false;
    this.searchName = 'name';
    /* this.getVideoByMetadata(); */
  }

  ngOnInit() {
    this.navService.setCurrentController(this);
    this.filteredData = this.videos;
    console.log(this.videos);
    this.totalVideos = this.videos.length;
    this.navService.checkPage(false);
    this.headerService.checkPage('digital-archive');
    // this.getKey();
    // this.getElementsToDisplay();
    /* this.route.queryParams.subscribe((params: Params) => {
      if (params !== null) {
        this.getElementsToDisplay(params.sl);
      }
    }); */

    this.getAllLanguagesVideoToDisplay();
    // this.getMetadatasByVideo();
  }



  getKey() {
    this.elementService.getKey().subscribe(res => {
      this.results = res;
      this.key = this.results.key;
      localStorage.setItem('key', this.key);
      this.videoService.getElements(this.key).then((success) => {
        console.log('success', success);
        this.videos = success;
        console.log('videos success', this.videos);
        this.filteredData = this.videos;
      });
    });
  }

  /* getElementsToDisplay(language) {
    this.elementService.getElementsToDisplay(language).subscribe((res: any) => {
      for (const video of res.elements) {
        this.filteredData.push(video);
      }

    });
  } */

  getAllLanguagesVideoToDisplay() {
    for (const lang of this.languages) {
      this.elementService.getElementsToDisplay(lang).subscribe((res: any) => {
        for (const video of res.elements) {
          this.videos.push({ videoElement: video, folder: res.pathParts[0] });
        }
      });
    }
    setTimeout(() => {
      this.route.queryParams.subscribe((params: Params) => {
        if (params.sl) {
          this.searchTerm = params.sl;
          this.setFilteredData('name');
        }
      });
    }, 1000);
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
        let x: any;
        let y: any;
        let z: any;
        for (x of response.CMD.Components['SL-TLA']['SL-Resources']) {
          for (y of x['SL-AnnotationDocument']) {
            for (z of response.CMD.Resources.ResourceProxyList.ResourceProxy) {
              if (y.ref === z.id && z.ResourceType.mimetype === 'text/vtt') {
                console.log(z.ResourceRef);
              }
            }
          }
        }
      });
    });

  }

  /* getVideoByMetadata() {
    this.elementService.searchMetadata('name=cmdi').subscribe((response: any) => {
      for (const hit of response.hits) {
        const json = JSON.parse(hit);
        const streamContent = json.streamContent;
        const CMD = streamContent.CMD;
        const keywords = CMD.Components['SL-TLA']['SL-Content'].descriptions.Description;
        if (keywords.includes('Deaf School')) {
          for(CMD['Resources']['ResourceProxyList']['ResourceProxy']){
            console.log
          }
          console.log(CMD['Resources']['ResourceProxyList']['ResourceProxy']['ResourceRef']);
        }
      }
    });
  } */

  /*  getElements(key) {
     this.elementService.getElements(key).subscribe(
       res => {
         console.log('all elements', res);
         this.dataResult = res;

         this.dataResult.elements.map(value => {
           if (value.mimeType === 'video/mp4') {
             this.videos.push(value);
             this.filteredData = this.videos;
             // this.getVideoByName(value.name);
           }
         });
       },
       error => {
         console.log(error);
       }
     );
   }

   getVideoByName(videoName: string) {
     let key = localStorage.getItem('key');
     this.elementService.getElementByName(key, videoName).subscribe(
       res => {
         console.log('video informations', res)
         this.video = res;
         this.originalName = this.video.name;
         this.getMetadataKey(key, videoName, 'oai_dc');
       },
       error => {
         console.log('error', error);
       }
     );
   }

   getMetadataKey(key, name, metadataName) {
     this.elementService
       .getElementByName(key, name + '&metadata=' + metadataName)
       .subscribe(
         res => {
           console.log('metadata res', res)
           this.metadata = res;
           let key = this.metadata.key;
           this.getMetadataByKey(key, name);
         },
         error => {
           console.log(error);
         }
       );
   }

   getMetadataByKey(key, name) {
     this.elementService.getElementByKey(key).subscribe(
       res => {
         console.log('metadata by key', res);
         this.metadataResults = Object.values(res);
         this.metadataResults.map(value => {
           value.map(v => {
             if (v.value.includes('thumb:')) {
               const formatedThumb = v.value.substr(6);
               this.getThumbByName(formatedThumb);
               this.videos.map(video => {
                 if (name === video.name) {
                   video.thumbName = formatedThumb;
                 }
               });
             } else {
             }
           });
         });
         console.log('this.videos', this.videos);
       },
       error => {
         console.log(error);
       }
     );
   }

   getThumbByName(name) {
     // this.loading = true;
     let key = localStorage.getItem('key');
     this.elementService.getElementByName(key, name).subscribe(
       res => {
         console.log('get thumb by name', res);
         // this.loading = false;
         this.thumbRes = res;
         // console.log("thumb by name", this.thumbRes);
         this.videos.map(video => {
           if (name === video.thumbName) {
             let base = this.basicUrl + 'content/key/' + this.thumbRes.key;
             video.thumb = base;
           } else {
             video.thumb = './assets/image/default-thumb.jpg';
           }
         });
       },
       error => {
         // this.loading = false;
         console.log('error', error);
       }
     );
   } */


  onChange(event: any) {
    if (event.value === 'name') {
      this.filteredData.sort((a, b) => a.name.localeCompare(b.name));
    }
  }




  onDisplayModeChangeGrid(): void {
    this.displayMode = 1;
    this.isGrid = false;
  }

  onDisplayModeChangeList(): void {
    this.isGrid = true;
    this.displayMode = 2;
  }

  toggleDisplayMode(): void {
    this.isGrid = !this.isGrid;
  }

  setFilteredData(what?: any) {
    if (what) {
      if (what === 'name') {
        this.filteredData = this.videos.filter(item => {
          return (
            item.videoElement.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
          );
        });
      } else if (what === 'metadata') {
        if (this.searchTerm.length < 4 || this.searchTerm === '') {
          this.filteredData = [];
          this.filteredData = this.videos;
        } else {
          this.elementService.searchMetadata(this.searchTerm).subscribe((response: any) => {
            this.videosByMetadata = [];
            const hits = response.hits;
            for (const hit of hits) {
              const json = JSON.parse(hit);
              const streamContent = json.streamContent;
              const CMD = streamContent.CMD;
              let resourceProxy = CMD.Resources['ResourceProxyList'].ResourceProxy;
              if (resourceProxy === undefined) {
                resourceProxy = CMD.Resources['ResourceProxyList'];
                console.log(streamContent);
              }
              for (const resource of resourceProxy) {
                const mimetype = resource.ResourceType.mimetype;
                if (mimetype === 'video/mp4') {
                  // LIS/Videos%20compressed%20for%20streaming/T2.4-LIS-F-LE01-2-20170801.mp4
                  const resourceRef = resource.ResourceRef;
                  const videoName = resourceRef.substring(resourceRef.lastIndexOf('/') + 1, resourceRef.length);
                  const folderName = resourceRef.substring(0, resourceRef.indexOf('/'));
                  this.videosByMetadata.push({ name: videoName, folder: folderName });
                }
              }
            }
            this.filteredData = [];
            for (const video of this.videosByMetadata) {
              this.filteredData.push({ videoElement: { name: video.name }, folder: video.folder });
            }
          });
        }
      }
    }
  }

  changeFilter(value) {
    if (value === 'name') {
      this.nameDisabled = true;
      this.metadataDisabled = false;
      this.searchName = value;
    } else {
      this.nameDisabled = false;
      this.metadataDisabled = true;
      this.searchName = value;
    }

  }

  goToVideoDetails(index) {
    let found = false;
    this.videoName = this.filteredData[index].videoElement.name;
    this.folder = this.filteredData[index].folder;
    const retrievedVideo = localStorage.getItem('latest');
    this.latestVideos = JSON.parse(retrievedVideo);
    if (this.latestVideos === null) {
      this.latestVideos = [];
    }
    for (let i = 0; i < this.latestVideos.length; i++) {
      if (this.latestVideos[i].name === this.videoName) {
        found = true;
        break;
      } else {
        found = false;
        break;
      }
    }
    if (found === false) {
      const count = this.latestVideos.length;
      if (count > 5) {
        this.latestVideos.shift();
      }
      this.latestVideos.push(this.filteredData[index]);
      // this.navService.shareLatestVideo.emit(this.latestVideos);
    }
    localStorage.removeItem('latest');
    localStorage.setItem('latest', JSON.stringify(this.latestVideos));
    this.router.navigate(['/digital-archive/details/'], { queryParams: { name: this.videoName, folder: this.folder } });

  }

  showDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
    console.log(this.toggleDropdown);
  }

  toggleSidenav() {
    //  console.log('toggle');
    this.opened = !this.opened;
  }

  sortByName() {
    // console.log("this.sortedValue", this.sortedValue)
    // console.log("before", this.filteredData);
    const sortedData = this.filteredData.slice(0);
    const that = this;

    sortedData.sort(function(a, b) {
      const x = a.name.toLowerCase();
      const y = b.name.toLowerCase();
      // return x - y;
      if (that.sortedValue == false) {
        return x < y ? -1 : x > y ? 1 : 0;
      } else if (that.sortedValue == true) {
        return x < y ? 1 : x > y ? -1 : 0;
      }
    });

    this.sortedValue = !this.sortedValue;
    this.filteredData = sortedData;
    // console.log("after", this.filteredData);
  }

  sortByDate() {
    const sortedData = this.filteredData.slice(0);
    sortedData.sort((a, b) => {
      const x: any = new Date(b.modification);
      const y: any = new Date(a.modification);
      return x - y;
    });
    this.filteredData = sortedData;
  }

}
