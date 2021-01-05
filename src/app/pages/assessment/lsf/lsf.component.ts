import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lsf',
  templateUrl: './lsf.component.html',
  styleUrls: ['./lsf.component.scss']
})
export class LsfComponent implements OnInit {

  videosMuted: any;

  ngOnInit(): void {
    this.videosMuted = document.getElementsByClassName('muted');
    for (const video of this.videosMuted) {
      video.muted = true;
    }
  }

}
