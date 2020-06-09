import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss']
})
export class SupportComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.checkPage('support');
  }

}
