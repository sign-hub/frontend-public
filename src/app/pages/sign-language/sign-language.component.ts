import { Router } from '@angular/router';
import { NavService } from './../../services/navigation-streaming-tool/nav.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header.service';
import { MapService } from 'src/app/services/map/map.service';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import OlFeature from 'ol/Feature';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import { Vector as VectorLayer } from 'ol/layer';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import { SignLanguagesService } from 'src/app/services/sign-languages-list/sign-languages.service';
import { NavigationGrammarToolService } from 'src/app/services/navigation-grammar-tool/navigation-grammar-tool.service';


@Component({
  selector: 'app-sign-language',
  templateUrl: './sign-language.component.html',
  styleUrls: ['./sign-language.component.scss']
})
export class SignLanguageComponent implements AfterViewInit, OnInit {



  @ViewChild('overlayElement', { static: false }) overlayElement: ElementRef;

  relations = [];
  vectorSource: any;
  vectorLayer: any;
  country: any = [];
  private languages: any;

  public errorMsg;
  private error = false;

  filteredData: any;
  markerSelected = false;
  markerSelectedContent;

  constructor(
    private languages_service: SignLanguagesService,
    private navigationGrammar: NavigationGrammarToolService,
    private headerService: HeaderService,
    private mapService: MapService,
    private navService: NavService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getLanguages();

    this.headerService.checkPage('sign-language');

    //this.mapService.mapLoad();

  }

  ngAfterViewInit(): void {
    this.placeIcon();
    this.mapService.emptyMap(this.overlayElement, this);
  }

  markerClickFunction(marker, event?) {
    if (marker == null)
      this.markerSelected = false;
    else
      this.markerSelected = true;
    console.log(event)
    console.log('marker', marker);
    this.markerSelectedContent = marker;
  }

  getLanguages() {
    this.languages_service.getSignLanguages().subscribe(
      data => {
        this.languages = data;
        let sortedData = this.languages.slice(0);
        let that = this;
        sortedData.sort(function (a, b) {
          var x = a.name.toLowerCase();
          var y = b.name.toLowerCase();

          return x < y ? -1 : x > y ? 1 : 0;


        });

        this.filteredData = sortedData;
        console.log(sortedData);
      },
      err => {
        this.error = true;
        this.errorMsg = err
      }
    )
  }

  placeIcon() {
    this.languages_service.getSignLanguages().subscribe(data => {
      this.filteredData = data;
      this.setIcon();
    });
  }

  setIcon() {

    for (var i = 0; i < this.filteredData.length; i++) {
      if (this.filteredData[i].coordinates != undefined && this.filteredData[i].coordinates != null) {
        this.filteredData[i].coordinates = this.filteredData[i].coordinates.replace('[', '').replace(']', '');
        // console.log(this.filteredData[i].coordinates.substr(0, 9) + ' ' + this.filteredData[i].coordinates.substr(11, 19));
        let coordstring = this.filteredData[i].coordinates.split(',');

        this.country[i] = new OlFeature({
          name: this.filteredData[i].name,
          code: this.filteredData[i].code,
          geometry: new Point(fromLonLat([parseFloat(coordstring[1]), parseFloat(coordstring[0])])),

        }, { description: this.filteredData[i].name })
        this.country[i].setStyle(new Style({
          text: new Text({
            font: "20px cinicon",
            text: '1',/* rappresenta il pallino circolare */
            fill: new Fill({
              color: '#000000'
            })
          })
        }));

      }
    }

    this.vectorSource = new VectorSource({
      features: this.country
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    this.mapService.setIcon(this.vectorLayer);

  }

  onLanguage() {
    this.languages_service.getLanguageDetail(this.markerSelectedContent.code).subscribe((data: any) => {
      this.router.navigate(['/sign-language/feature-details/', data.response.uuid]);
    });
  }

}
