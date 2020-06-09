import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Event, NavigationEnd } from '@angular/router';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';
import { SignLanguagesService } from 'src/app/services/sign-languages-list/sign-languages.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-navigation-sign-language',
  templateUrl: './navigation-sign-language.component.html',
  styleUrls: ['./navigation-sign-language.component.scss']
})
export class NavigationSignLanguageComponent implements OnInit {
  private languages: any = [];

  filteredData: any;
  searchTerm: any;
  urlName;
  public sort = false;
  public errorMsg;
  private error = false;
  toggleDropdown = false;
  toggleSearchDropdown = false;
  orderCode = false;
  code: boolean;
  placeholder: string;
  @ViewChild('toggleButton', { static: false }) toggleButton: ElementRef;
  @ViewChild('menu', { static: false }) menu: ElementRef;
  sortedValue = true;
  termsDisabled: boolean;
  slCodeDisabled: boolean;
  countriesDisabled: boolean;
  macroAreaDisabled: boolean;
  macroAreaList: any;
  macroAreas: any;
  sortedValueCode = true;
  constructor(
    // tslint:disable-next-line:variable-name
    private languages_service: SignLanguagesService,
    private router: Router,
    private navService: NavService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
  ) {


    // This events get called by all clicks on the page

    // this.renderer.listen("window", "click", (e: Event) => {
    //   if (
    //     e.target !== this.toggleButton.nativeElement &&
    //     e.target !== this.menu.nativeElement
    //   ) {
    //     this.toggleDropdown = false;
    //   }
    // });
    this.macroAreas = new FormControl();
    // TODO DINAMIC
    this.macroAreaList = ['Africa', 'Australia', 'Europe', 'North America', 'Papunesia', 'South America'];
    this.termsDisabled = true;
    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {

      } else if (event instanceof NavigationEnd) {
        const urlArray = event.url.split('/');
        const nameOfCountry = urlArray[urlArray.length - 1];
        const decodedUrl = decodeURIComponent(nameOfCountry);
        this.urlName = decodedUrl;
      }
    });


  }

  ngOnInit() {
    this.filteredData = this.getLanguages();
    console.log(this.filteredData);
    setTimeout(() => {
      this.toggleAscDesc();

    }, 700);
    // cons ole.log("url name", this.urlName)
    if (this.filteredData !== undefined) {
      this.filteredData.map(value => {
        // console.log(value)
        if (value.name === this.urlName) {
          value.isActive = true;
        } else {
          value.isActive = false;
        }

      });
    }

  }



  getLanguages() {
    this.languages_service.getSignLanguages().subscribe(
      data => {
        this.languages = data;
        const sortedData = this.languages.slice(0);
        this.filteredData = sortedData;
        this.toggleAscDesc();
      },
      err => {
        this.error = true;
        this.errorMsg = err;
      }
    );
  }

  sortByNameDesc() {
    this.filteredData.sort((a, b) => (a.name > b.name ? -1 : 1));
  }

  sortByNameAsc() {
    this.filteredData.sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  toggleAscDesc() {
    this.sortedValue = !this.sortedValue;
    if (this.sortedValue) {
      this.sortByNameAsc();
    } else {
      this.sortByNameDesc();
    }
  }


  setFilteredData() {
    this.filteredData = this.languages.filter(item => {
      return (
        item.name.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  setFilteredDataByCode() {
    this.filteredData = this.languages.filter(item => {
      console.log(item);
      return (
        item.code.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }

  refreshSearch(menuItem) {
    this.searchTerm = '';
    this.toggleSearchDropdown = !this.toggleSearchDropdown;
    if (menuItem === 'terms') {
      this.termsDisabled = true;
      this.slCodeDisabled = false;
      this.countriesDisabled = false;
      this.macroAreaDisabled = false;
      this.code = false;
      this.sortedValue = false;
      this.toggleAscDesc();
    } else if (menuItem === 'slCode') {
      this.termsDisabled = false;
      this.slCodeDisabled = true;
      this.countriesDisabled = false;
      this.macroAreaDisabled = false;
      this.code = true;
      this.sortedValueCode = false;
      this.toggleCodeAscDesc();
    } else if (menuItem === 'countries') {
      this.termsDisabled = false;
      this.slCodeDisabled = false;
      this.countriesDisabled = true;
      this.macroAreaDisabled = false;
      this.code = false;
    } else if (menuItem === 'macroarea') {
      this.termsDisabled = false;
      this.slCodeDisabled = false;
      this.countriesDisabled = false;
      this.macroAreaDisabled = true;
      this.code = false;
    }
  }

  openCountry(index, uuid) {
    /*
    this.filteredData.map( value => {
      // console.log(value)
      if(value.name == name ){
        value.isActive = true;
      }else{
        value.isActive = false;
      }

    })*/
    // console.log("after", this.filteredData)
    // this.router.navigate(['feature-details/'+ name]);
    this.router.navigate(['/sign-language/feature-details/', uuid]);
    this.navService.triggerSignLanguageContent();
  }

  showDropdown() {
    this.toggleDropdown = !this.toggleDropdown;
    // console.log(this.toggleDropdown);
  }

  showSearchDropdown() {
    this.toggleSearchDropdown = !this.toggleSearchDropdown;
    // console.log(this.toggleDropdown);
  }
  /*
    sortByName() {
      this.toggleDropdown = !this.toggleDropdown;
      const sortedData = this.languages.slice(0);
      const that = this;
      sortedData.sort(function (a, b) {
        const x = a.name.toLowerCase();
        const y = b.name.toLowerCase();
        if (that.sortedValue == false) {
          return x < y ? -1 : x > y ? 1 : 0;
        } else if (that.sortedValue === true) {
          return x < y ? 1 : x > y ? -1 : 0;
        }
      });
      this.sortedValue = !this.sortedValue;
      this.filteredData = sortedData;
    }
   */
  sortByCodeAsc() {
    this.filteredData.sort((a, b) => (a.code > b.code ? -1 : 1));
  }

  sortByCodeDesc() {
    this.filteredData.sort((a, b) => (a.code < b.code ? -1 : 1));
  }

  toggleCodeAscDesc() {
    this.sortedValueCode = !this.sortedValueCode;
    if (this.sortedValueCode) {
      this.sortByCodeDesc();
    } else {
      this.sortByCodeAsc();
    }
  }

  setFilterByMacroArea(event: any) {
    if (event && event.length > 0) {
      this.filteredData = this.languages.filter(item => {
        if (event.includes(item.area)) {
          return item;
        }
      });
    } else if (event.length < 1) {
      this.filteredData = this.languages;
    }
  }

  setFilteredDataByCountries() {
    this.filteredData = this.languages.filter(item => {
      return (
        item.countries.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1
      );
    });
  }
}
