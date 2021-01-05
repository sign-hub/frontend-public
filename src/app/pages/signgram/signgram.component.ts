import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { HeaderService, CustomMobileQuery } from 'src/app/services/header/header.service';
import { SigngramService } from 'src/app/services/signgram/signgram.service';
import { Router } from '@angular/router';

declare var require: any
const FileSaver = require('file-saver');

@Component({
  selector: 'app-signgram',
  templateUrl: './signgram.component.html',
  styleUrls: ['./signgram.component.scss']
})
export class SigngramComponent implements OnInit, OnDestroy {
  opened: boolean;
  customMobileQuery: CustomMobileQuery;
  grammars: Array<any>;
  displayedColumns: string[] = ['name', 'actions'];
  dataSource = [];
  pageTitle: string;
  termSearched: string;
  what: string;
  grammarNameDisabled: boolean;
  slCodeDisabled: boolean;
  whatOb: string;
  filteredList: any;

  constructor(private headerService: HeaderService,
    private signgramService: SigngramService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef
  ) {
    this.customMobileQuery = this.headerService.retrieveMobileQueryObject(changeDetectorRef);
    this.grammarNameDisabled = true;
    this.slCodeDisabled = false;
    this.what = 'grammarName';
    this.whatOb = null;

  }

  ngOnInit() {
    this.headerService.checkPage('grammar');
    this.headerService.detectPage.subscribe(
      data => {
        console.log("page title", data);
        this.pageTitle = data;
      });

    // console.log(this.headerService.checkPage('grammar'));
    // this.opened = true;
    this.opened = !this.customMobileQuery.mobileQuery.matches;
    this.signgramService.getGrammarList().subscribe((ret) => {
      if (ret) {
        if (ret['status'] == 'OK')
          this.grammars = ret['response'];
        console.log(this.grammars);
        this.dataSource = this.grammars;
      }
    })
  }

  openGrammar(element) {
    // console.log(element);
    this.router.navigate(['grammardetail/' + element.uuid]);
  }

  ngOnDestroy(): void {
    this.customMobileQuery.mobileQuery.removeListener(this.customMobileQuery.mobileQueryListener);
  }

  toggleSidenav() {
    //  console.log('toggle');
    this.opened = !this.opened;
  }

  filterChanged(what) {
    if (what === 'slCode') {
      this.what = 'signLanguage';
      this.whatOb = 'code';
      this.slCodeDisabled = true;
      this.grammarNameDisabled = false;
    } else if (what === 'grammarName') {
      this.what = 'grammarName';
      this.whatOb = null;
      this.slCodeDisabled = false;
      this.grammarNameDisabled = true;
    }
  }
  downloadFile(uuid, filename) {
    const fileUrl = this.signgramService.downloadGrammarLink(uuid);
    const fileName = filename;
    FileSaver.saveAs(fileUrl, fileName);
  }

}
