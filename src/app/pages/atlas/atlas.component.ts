import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderService, CustomMobileQuery } from 'src/app/services/header/header.service';
import { MapService } from 'src/app/services/map/map.service';


@Component({
  selector: 'app-atlas',
  templateUrl: './atlas.component.html',
  styleUrls: ['./atlas.component.scss']
})
export class AtlasComponent implements OnInit,OnDestroy {
  customMobileQuery: CustomMobileQuery;
  opened: boolean;

  constructor(
    private headerService: HeaderService,
    private mapService: MapService,
    changeDetectorRef: ChangeDetectorRef
    ) {
      this.customMobileQuery = this.headerService.retrieveMobileQueryObject(changeDetectorRef);
      
     }

  ngOnInit() {
    this.headerService.checkPage('atlas');
    this.opened = !this.customMobileQuery.mobileQuery.matches;
    // console.log(this.customMobileQuery.mobileQuery);
    //this.mapService.mapLoad();

  }

  ngOnDestroy(): void {
     this.customMobileQuery.mobileQuery.removeListener(this.customMobileQuery.mobileQueryListener);
  }

  toggleSidenav() {
    console.log('toggle');
    this.opened = !this.opened;
  }


}
