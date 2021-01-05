import { Component, OnInit, ChangeDetectorRef, NgZone, Inject } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  pageTitle;
  isShown: boolean;
  showMenu: boolean;
  isShownStreaming: boolean;
  hideMobileMenu: boolean;
  public innerWidth: any;

  constructor(
    private headerService: HeaderService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    this.isShown = false;
    this.isShownStreaming = false;
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 1000) {
      this.hideMobileMenu = true;
    } else {
      this.hideMobileMenu = false;
    };
    window.onresize = (e) => {
      this.ngZone.run(() => {
        if (window.innerWidth < 1000) {
          this.hideMobileMenu = true;
        } else {
          this.hideMobileMenu = false;
        }
      });
    };
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.headerService.detectPage.subscribe(
      data => {
        console.log("page title", data);
        this.pageTitle = data;
        this.cdRef.detectChanges();
        // if(this.pageTitle == 'digital-archive'){
        //   console.log('yes it is')
        // }
      }
    );
  }

  toggleMobileMenu() {
    this.hideMobileMenu = !this.hideMobileMenu;
  }

  closeSubMenu(bool) {
    this.isShown = !bool;
    this.isShownStreaming = !bool;
  }

  redirect() {
    window.open('http://platform.sign-hub.eu/');

    // window.open('https://10.6.0.162', '_blank');
  }

}
