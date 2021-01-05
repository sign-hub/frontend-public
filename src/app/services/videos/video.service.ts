import { Injectable } from '@angular/core';
import { ElementsService } from '../elements/elements.service';
import { Constant } from 'src/app/helpers/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  dataResult: any;
  videos: any = [];
  filteredData;
  video: any;
  originalName: any;
  metadata: any;
  metadataResults: any;
  thumbRes: any;
  basicUrl = Constant.baseUrlDemo;

  constructor(private elementService: ElementsService) { }


  getElements(key) {
    return new Promise((resolve) => {
      this.elementService.getElementsToDisplay(key).subscribe(
        res => {
          this.dataResult = res;

          this.dataResult.elements.map(value => {
            if (value.mimeType == "video/mp4") {
              this.videos.push(value);
              this.filteredData = this.videos;
              this.getVideoByName(value.name).then((success) => {
                resolve(success);
              });
            }
          });
        },
        error => {
          console.log(error);
        }
      );
    })

  }

  getVideoByName(videoName: string) {
    return new Promise((resolve) => {
      let key = localStorage.getItem("key");
      this.elementService.getElementByName(key, videoName).subscribe(
        res => {
          this.video = res;
          this.originalName = this.video.name;
          this.getMetadataKey(key, videoName, "oai_dc").then((success) => {
            resolve(success)
          });
        },
        error => {
          console.log("error", error);
        }
      );
    })

  }

  getMetadataKey(key, name, metadataName) {
    return new Promise((resolve) => {
      this.elementService.getElementByName(key, name /* + "&metadata=" + metadataName */).subscribe(
        res => {
          this.metadata = res;
          let key = this.metadata.key;
          this.getMetadataByKey(key, name).then((success) => {
            resolve(success);
          });
        },
        error => {
          console.log(error);
        }
      );
    })

  }

  getMetadataByKey(key, name) {
    return new Promise((resolve) => {
      this.elementService.getElementByKey(key).subscribe(
        res => {
          this.metadataResults = Object.values(res);
          this.metadataResults.map(value => {
            value.map(v => {
              if (v.value.includes("thumb:")) {
                let formatedThumb = v.value.substr(6);
                this.getThumbByName(formatedThumb).then((success) => {
                  resolve(success)
                });
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
    })

  }

  getThumbByName(name) {
    return new Promise((resolve, reject) => {
      // this.loading = true;
      let key = localStorage.getItem("key");
      this.elementService.getElementByName(key, name).subscribe(
        res => {
          // this.loading = false;
          this.thumbRes = res;
          // console.log("thumb by name", this.thumbRes);
          this.videos.map(video => {
            if (name === video.thumbName) {
              let base = this.basicUrl + "content/key/" + this.thumbRes.key;
              video.thumb = base;
              // resolve(video.thumb)
            } else {
              video.thumb = "./assets/image/default-thumb.jpg";
              // resolve(video.thumb)
            }
          });
          resolve(this.videos)
          this.videos = [];
        },
        error => {
          // this.loading = false;
          reject();
          console.log("error", error);
        }
      );
    })

  }
}
