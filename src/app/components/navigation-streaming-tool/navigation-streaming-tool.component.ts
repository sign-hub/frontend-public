import { DigitalArchiveComponent } from './../../pages/digital-archive/digital-archive.component';
import { DigitalArchiveService } from './../../services/digital-archive/digital-archive.service';
import { Component, OnInit, ChangeDetectorRef, HostListener, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { ElementsService } from 'src/app/services/elements/elements.service';
import { Router, Params } from '@angular/router';
import { Constant } from 'src/app/helpers/constant/constant';
import { VideoService } from 'src/app/services/videos/video.service';

@Component({
  selector: 'app-navigation-streaming-tool',
  templateUrl: './navigation-streaming-tool.component.html',
  styleUrls: ['./navigation-streaming-tool.component.scss']
})
export class NavigationStreamingToolComponent implements OnInit {
  totalVideos;
  isPageDetails = false;
  filteredData: any = [];
  searchTerm = '';
  results: any;
  key;
  dataResult: any;
  videos: any = [];
  basicUrl = Constant.baseUrlDemo;
  videoName;
  duration: any;
  passParams;
  thumbRes: any;
  video: any;
  originalName: any;
  metadata: any;
  metadataResults: any;

  @ViewChild('parent', { read: ViewContainerRef, static: true })
  parent: ViewContainerRef;

  public controllerDigitalArchive: any;
  constructor(
    private navService: NavService,
    private cdRef: ChangeDetectorRef,
    private elementService: ElementsService,
    private router: Router,
    private videoService: VideoService,
    private digitalArchiveService: DigitalArchiveService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    this.controllerDigitalArchive = this.navService.getCurrentController();
    this.navService.setCurrentNavBar(this);
  }

  ngOnInit() {
    this.navService.detectPage.subscribe(data => {
      this.isPageDetails = data;
      this.cdRef.detectChanges();
    });
    /* this.getKey(); */

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(DigitalArchiveComponent);
    this.parent.createComponent(childComponent);
    this.parent.clear();

  }

  getKey() {
    this.elementService.getKey().subscribe(res => {
      this.results = res;
      this.key = this.results.key;
      this.getElements(this.key);
      localStorage.setItem('key', this.key);
    })
  }

  getElements(key) {
    this.elementService.getElementsToDisplay(key).subscribe(
      res => {

        this.dataResult = res;
        this.dataResult.elements.map(value => {
          if (value.mimeType === 'video/mp4') {
            this.videos.push(value);
            this.filteredData = this.videos;
            this.getVideoByName(value.name);

          }
          this.totalVideos = this.videos.length;
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

        this.video = res;
        this.originalName = this.video.name;
        // this.getMetadataKey(key, videoName, 'oai_dc');
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

        this.metadataResults = Object.values(res);
        this.metadataResults.map(value => {
          value.map(v => {
            if (v.value.includes('thumb:')) {
              let formatedThumb = v.value.substr(6);
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

  getVideoByMetadata(searchTerm) {
    this.digitalArchiveService.getVideoByMeatadata(searchTerm).subscribe(data => {
      this.controllerDigitalArchive.videos = data;
      console.log(data);
    });
  }

  getWorkspace() {
    this.navService.getWorkspaces().subscribe(
      res => {
        console.log(res);
      },
      error => {
        console.log(error);
      }
    );
  }

  setFilteredData() {
    this.filteredData = this.videos.filter(item => {
      return (
        item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  refreshSearch() {
    this.filteredData = this.videos;
    this.searchTerm = '';
  }


  goToVideoDetails(index) {
    this.videoName = this.videos[index].name;
    this.router.navigate(['/digital-archive/details/', this.videoName]);
    this.navService.triggerDetailsContent(this.videoName);
  }

}
