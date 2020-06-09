import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header.service';

@Component({
  selector: 'app-connects',
  templateUrl: './connects.component.html',
  styleUrls: ['./connects.component.scss']
})
export class ConnectsComponent implements OnInit {

  constructor(private headerService: HeaderService) { }

  ngOnInit() {
    this.headerService.checkPage('connect');
  }

}
