import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { HeaderService } from 'src/app/services/header/header.service';
import { ElementsService } from 'src/app/services/elements/elements.service';
import { Constant } from 'src/app/helpers/constant/constant';
import { VideoService } from 'src/app/services/videos/video.service';

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
  keySort = 'name'; //set default
  reverse = false;
  videoName;
  thumbRes: any;
  loading = false;
  originalName: any;

  sortedValue = false; // ascc
  opened = true;
  latestVideos: any = [];

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
  }

  ngOnInit() {
    this.navService.setCurrentController(this);
    this.filteredData = this.videos;
    this.totalVideos = this.videos.length;
    this.navService.checkPage(false);
    this.headerService.checkPage('digital-archive');
    this.getKey();
  }



  getKey() {
    this.elementService.getKey().subscribe(res => {
      this.results = res;
      this.key = this.results.key;
      localStorage.setItem('key', this.key);
      this.videoService.getElements(this.key).then((success) => {
        console.log('success', success)
        this.videos = success;
        console.log('videos success', this.videos);
        this.filteredData = this.videos;
        this.setFilteredDataPrepopulate();
      });
    });
  }

  getElements(key) {
    this.elementService.getElements(key).subscribe(
      res => {
        console.log('all elements', res);
        this.dataResult = res;

        this.dataResult.elements.map(value => {
          if (value.mimeType === 'video/mp4') {
            this.videos.push(value);
            this.filteredData = this.videos;
            this.getVideoByName(value.name);
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
  }


  onChange(event: any) {
    if (event.value == 'name') {
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

  setFilteredData() {
    this.filteredData = this.videos.filter(item => {
      return (
        item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  setFilteredDataPrepopulate() {
    if (this.searchTerm === undefined) {
      return;
    }
    this.filteredData = this.videos.filter(item => {
      return (
        item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  goToVideoDetails(index) {
    let found = false;
    this.videoName = this.filteredData[index].name;
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
      let count = this.latestVideos.length;
      if (count > 5) {
        this.latestVideos.shift();
      }
      this.latestVideos.push(this.filteredData[index]);
      // this.navService.shareLatestVideo.emit(this.latestVideos);
    }
    localStorage.removeItem('latest');
    localStorage.setItem('latest', JSON.stringify(this.latestVideos));
    this.router.navigate(['/digital-archive/details/', this.videoName]);

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
    let sortedData = this.filteredData.slice(0);
    let that = this;

    sortedData.sort(function (a, b) {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
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
