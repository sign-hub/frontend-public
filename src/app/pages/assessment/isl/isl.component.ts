import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-isl',
  templateUrl: './isl.component.html',
  styleUrls: ['./isl.component.scss']
})
export class IslComponent implements OnInit {

  videosMuted: any;

  ngOnInit(): void {
    this.videosMuted = document.getElementsByClassName('muted');
    for (const video of this.videosMuted) {
      video.muted = true;
    }
  }

}
