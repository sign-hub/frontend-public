import { Component, OnInit, HostListener, SimpleChanges, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { HeaderService } from 'src/app/services/header/header.service';
import { MapService } from 'src/app/services/map/map.service';
import { NavigationGrammarToolService } from 'src/app/services/navigation-grammar-tool/navigation-grammar-tool.service';
import { SignLanguagesService } from 'src/app/services/sign-languages-list/sign-languages.service';
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

@Component({
  selector: 'app-grammar-feature',
  templateUrl: './grammar-feature.component.html',
  styleUrls: ['./grammar-feature.component.scss']
})
export class GrammarFeatureComponent implements AfterViewInit, OnInit {
  @ViewChild('overlayElement', { static: false }) overlayElement: ElementRef;
  @Input() changeSome: any;
  //il ciclo inizia con le 5 shapes senza colori e senza pattern,
  //poi alle shapes aggiungo

  showCloseButton: boolean = false;
  showInfo: boolean = false;
  informationIndex;
  listOption = [];
  relations = []
  OpzioniLength;
  opzioniSelezionate = [];
  listFeature: any = [];
  featureSelected = [];
  infoFeature = [];
  country: any = [];
  featureOption = 0;
  Feature = false;
  vectorSource: any;
  vectorLayer: any;
  controllerNavigationGrammarFeature: any;

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.closeInformation(null);
  }
  constructor(
    private grammar_service: SignLanguagesService,
    private navigationGrammar: NavigationGrammarToolService,
    private headerService: HeaderService,
    private mapService: MapService
  ) {
    this.controllerNavigationGrammarFeature = this.navigationGrammar.getCurrentController();
  }

  ngOnInit() {
    this.headerService.checkPage('grammar-feature');
    // this.mapService.emptyMap();
    // this.placeIcon();
    this.getGrammarFeatures();
    this.onFeatureSelected();
  }

  ngAfterViewInit(): void {
    this.placeIcon();
    this.mapService.emptyMap(this.overlayElement);
  }

  placeIcon() {
    this.navigationGrammar.coord.subscribe(data => {
      this.relations = data;
      this.setIcon();
    })
  }

  setIcon() {
    this.country = [];
    for (var i = 0; i < this.relations.length; i++) {
      if (this.relations[i].coordinate != undefined && this.relations[i].coordinate != null &&
        this.relations[i].coordinate.lat != undefined && this.relations[i].coordinate.lat != null &&
        this.relations[i].coordinate.lon != undefined && this.relations[i].coordinate.lon != null) {
        console.log(this.relations[i].coordinate);
        this.country[i] = new OlFeature({

          geometry: new Point(fromLonLat([this.relations[i].coordinate.lon, this.relations[i].coordinate.lat])),

        }, { description: 'This is the value of<br>the description attribute' })
        this.country[i].setStyle(new Style({
          text: new Text({
            font: "20px cinicon",
            text: this.relations[i].icone.text,
            fill: new Fill({
              color: this.relations[i].icone.color
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

  onFeatureSelected() {
    this.navigationGrammar.grammarFeatures.subscribe(
      data => {
        this.listOption = data;
        this.Feature = true;
        this.getGrammarFeatures();
        this.featureSelected = [];
        this.OpzioniLength = 0;

        for (var i = 0; i < this.listOption.length; i++) {
          for (var y = 0; y < this.listFeature.length; y++) {
            if (this.listOption[i].idFeature == this.listFeature[y].uuid) {
              //var idFeat = this.listOption[i].idFeature; //stringa idFeature
              //var idOpt = this.listOption[i].id; // string id Option
              let found = null;
              for (var k = 0; k < this.featureSelected.length; k++) {
                if (this.featureSelected[k].id == this.listFeature[y].uuid) {
                  found = k;
                  break;
                }
              }

              if (found == null) {
                this.featureSelected.push(
                  {
                    'id': this.listFeature[y].uuid,
                    'area': this.listFeature[y].area.name,
                    'name': this.listFeature[y].name,
                    'description': this.listFeature[y].featureDescription,
                    'options': [this.listOption[i].item],
                    'idOption': [this.listOption[i].id],
                    'OptionLength': Object.keys(this.listFeature[y].options).length
                  });
              } else {
                this.featureSelected[k].options.push(this.listOption[i].item);
                this.featureSelected[k].idOption.push(this.listOption[i].id);
              }

              /*if (i == 0) {
                this.featureSelected.push(
                  {
                    'id': this.listFeature[y].uuid,
                    'area': this.listFeature[y].area.name,
                    'name': this.listFeature[y].name,
                    'description': this.listFeature[y].featureDescription,
                    'options': [this.listOption[i].item],
                    'idOption': [this.listOption[i].id],
                    'OptionLength': Object.keys(this.listFeature[y].options).length
                  });
              } else {
                if (this.listOption[i].idFeature == this.listOption[i - 1].idFeature) {
                  var prec = this.featureSelected.length - 1;
                  this.featureSelected[prec].options.push(this.listOption[i].item);
                } else {
                  this.featureSelected.push(
                    {
                      'id': this.listFeature[y].uuid,
                      'area': this.listFeature[y].area.name,
                      'name': this.listFeature[y].name,
                      'description': this.listFeature[y].featureDescription,
                      'options': [this.listOption[i].item],
                      'idOption': [this.listOption[i].id],
                      'OptionLength': Object.keys(this.listFeature[y].options).length
                    });
                }

              } */
              break;
            }
          }
        }
        this.Relations();
      }, err => console.log(err)
    )
    // console.log(this.listFeature);
  }

  Relations() {
    this.grammar_service.searchByFeatures({ request: this.featureSelected }).subscribe((data) => {
      console.log(data);
      if (data['status'] == 'OK')
        this.navigationGrammar.featureRetrieved.emit(data['response']);

    }, (err) => {
      console.log(err);
    })
    //this.navigationGrammar.featureSelected.emit(this.featureSelected);
  }

  removeFeature(feature) {
    console.log(feature);
    for (var i = 0; i < this.listOption.length; i++) {
      if (this.listOption[i].idFeature == feature.id) {
        console.log(this.listOption[i]);
        this.navigationGrammar.deleteFeatures.emit(this.listOption[i]);
        for (var j = 0; j < this.featureSelected.length; j++) {
          if (this.featureSelected[j].id == feature.id) {
            this.featureSelected.splice(j, 1);
            if (this.featureSelected.length == 0) {
              this.Feature = false;
            }
          }
        }

      }
    }
    if (this.featureSelected.length > 0) {
      this.placeIcon();
      this.controllerNavigationGrammarFeature.OnSubmit();
    } else {
      this.controllerNavigationGrammarFeature.relation = [];
      this.controllerNavigationGrammarFeature.step = 0;
      this.vectorSource.clear();
      this.controllerNavigationGrammarFeature.deselectAll();
      this.controllerNavigationGrammarFeature.isChecked = false;
      this.controllerNavigationGrammarFeature.checkSubmit = 0.3;
      /*  this.controllerNavigationGrammarFeature.treeControl.collapseAll();
       this.controllerNavigationGrammarFeature.treeControl.resetFilters(); */
    }
  }

  showInformation(index) {
    if (this.informationIndex == null || this.informationIndex == undefined) {
      this.informationIndex = index;
    }
    if (this.informationIndex != index) {
      this.showInfo = true;
      this.informationIndex = index;
    } else {
      this.showInfo = !this.showInfo;
    }

    this.infoFeature = this.featureSelected[index];
    this.showCloseButton = true;
  }

  closeInformation(index?) {
    this.showInfo = false;
    this.showCloseButton = false;
  }

  getGrammarFeatures() {
    return this.grammar_service.getGrammarFeaturesSelected().subscribe(
      data => {
        this.listFeature = data;
      },
      err => {
        console.log(err);
      });
  }

  viewFeature() {
    console.log('View Feature')
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['changeSome']) {
      // console.log(changes['changeSome']);
      //this.mapService.setIcon(this.vectorLayer)
    }
  }

}






export interface BreadCrumb {
  label: string;
  url: string;
};
