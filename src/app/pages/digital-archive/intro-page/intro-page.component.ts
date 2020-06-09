import { HeaderService } from './../../../services/header/header.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss']
})
export class IntroPageComponent implements OnInit {

  constructor(private headerService: HeaderService) {

  }

  ngOnInit() {
    this.headerService.checkPage('life-stories-intro');
  }

}
