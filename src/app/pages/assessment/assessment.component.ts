import { HeaderService, CustomMobileQuery } from './../../services/header/header.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-assessment',
  templateUrl: './assessment.component.html',
  styleUrls: ['./assessment.component.scss']
})
export class AssessmentComponent implements OnInit {

  customMobileQuery: CustomMobileQuery;
  opened: boolean;
  constructor(private headerService: HeaderService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.customMobileQuery = this.headerService.retrieveMobileQueryObject(changeDetectorRef);

  }

  ngOnInit() {
    this.headerService.checkPage('assessment');
    this.opened = !this.customMobileQuery.mobileQuery.matches;
  }

  ngOnDestroy(): void {
    this.customMobileQuery.mobileQuery.removeListener(this.customMobileQuery.mobileQueryListener);
  }

  toggleSidenav() {
    console.log('toggle');
    this.opened = !this.opened;
  }

}
