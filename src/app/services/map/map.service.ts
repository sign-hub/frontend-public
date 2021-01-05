import { Injectable } from '@angular/core';
import OlMap from 'ol/Map';
import OlXYZ from 'ol/source/XYZ';
import OlTileLayer from 'ol/layer/Tile';
import OlView from 'ol/View';
import OlOverlay from 'ol/Overlay';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import $ from 'jquery';

//const tileUrl = 'https://maps.wikimedia.org/osm-intl/3/4/3.png?lang=en';
const tileUrl = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';
/* const tileUrl = 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png?lang=en'; */

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  view: OlView;
  popup: OlOverlay;
  vectorSource: any;
  vectorLayer: any;
  markersLayer: any;
  controls: { selector: any; };
  overlayElement: any;
  markerClickController: { markerClickFunction: (arg0: any, arg1: any) => void; };
  coords: any;

  constructor() { }

  emptyMap(overlayElement?, markerClickController?) {
    this.overlayElement = overlayElement;
    this.markerClickController = markerClickController;
    /*this.source = new OlXYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    });*/
    this.source = new OlXYZ({
      url: tileUrl,
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: fromLonLat([10, 40]),
      geometry: new Point(fromLonLat([-87.623177, 41.881832])),
      zoom: 3
    });

    this.map = new OlMap({
      target: 'map',
      layers: [this.layer],
      view: this.view
    });
    // this.element = document.getElementById('popup');
    this.popup = new OlOverlay({
      element: this.overlayElement.nativeElement,
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -50]
    });
    this.map.addOverlay(this.popup);
    this.addingControls();
  }

  emptyMapDetail(markerCoordinates, funzione?: any) {
    // console.log(markerCoordinates)
    console.log('qui');
    if (!markerCoordinates || markerCoordinates == null) {
      markerCoordinates = '[10,40]';
    }
    if (typeof markerCoordinates == 'string') {
      markerCoordinates = markerCoordinates.replace('[', '').replace(']', '');
      this.coords = markerCoordinates.split(',');
    } else {
      this.coords = markerCoordinates;
    }
    // console.log(this.coords);
    /*this.source = new OlXYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    });*/
    this.source = new OlXYZ({
      url: tileUrl,
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: fromLonLat([parseFloat(this.coords[1]), parseFloat(this.coords[0])]),
      // geometry: new Point(fromLonLat([-87.623177, 41.881832])),
      geometry: new Point(fromLonLat([parseFloat(this.coords[1]), parseFloat(this.coords[0])])),
      zoom: 3
    });
    if (this.map === undefined) {
      this.map = new OlMap({
        target: 'map-s',
        layers: [this.layer],
        view: this.view
      });
    } else {
      this.map.setTarget('map-s');
      this.map.setView(this.view);
    }
    // this.element = document.getElementById('popup');
    this.addingControls();
  }


  mapLoad(newlayer) {
    /*this.source = new OlXYZ({
      url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    });*/

    this.source = new OlXYZ({
      url: tileUrl,
    });

    this.layer = new OlTileLayer({
      source: this.source
    });

    this.view = new OlView({
      center: fromLonLat([-87.623177, 41.881832]),
      geometry: new Point(fromLonLat([-87.623177, 41.881832])),
      zoom: 3
    });

    // this.map = new OlMap({
    //   target: 'map',
    //   layers: [this.layer,languages],
    //   view: this.view
    // });
    this.map = new OlMap({
      target: 'map',
      layers: [this.layer],
      view: this.view
    });
    if (newlayer !== undefined && newlayer !== null) {
      this.map.addLayer(newlayer);
    }

  }

  mapAddLayer(layer) {
    if (layer === undefined || layer === null) {
      return;
    }
    if (this.map === undefined || this.map === null) {
      this.mapLoad(layer);
    } else {
      if (this.markersLayer != undefined && this.markersLayer != null) {
        this.map.removeLayer(this.markersLayer);
      }
      this.markersLayer = layer;
      this.map.addLayer(this.markersLayer);

    }
  }

  setIcon(countries) {
    if (this.map !== undefined) {
      if (this.map.getTarget() === 'map') {
        const view = this.map.getView();
        const source = countries.getSource();
        const layerExtent = source.getExtent();
        if (!layerExtent) {
          view.fit(layerExtent, { maxZoom: 3 });
        }
      }
    }

    this.mapAddLayer(countries);

  }



  addingControls() {
    /*this.controls = {
     selector: new Control.SelectFeature(this.markersLayer, { onSelect: this.createPopup, onUnselect: this.destroyPopup })
   };
   this.map.addControl(this.controls['selector']);
   this.controls['selector'].activate();*/
    this.map.on('click', (event) => {
      // console.log('addingControlClick', event);
      // console.log(this.map);
      let features = [];
      features = this.map.getFeaturesAtPixel(event.pixel, 21);
      // console.log(event.pixel);
      /*this.map.forEachFeatureAtPixel(event.pixel,
          (feature, layer) => {
            console.log(feature);
              features = feature.get('features');
              const valuesToShow = [];
              if (features && features.length > 0) {
                  features.forEach( clusterFeature => {
                      valuesToShow.push(clusterFeature.get('name'));
                      console.log('feature ', clusterFeature);
                  });
              }

          },
          { hitTolerance: 1000 }
      );*/
      if (features !== undefined && features !== null && features.length > 0) {
        // console.log(features[0].getProperties());
        const feature = features[0];
        if (feature) {
          const coordinates = feature.getGeometry().getCoordinates();
          const pixel = this.map.getPixelFromCoordinate(coordinates);
          // console.log('pixel ', pixel);
          // this.popup.setPosition(coordinates);
          this.markerClickController.markerClickFunction(feature.getProperties('name'), event);
          /*this.overlayElement.nativeElement.popover({
            placement: 'top',
            html: true,
            content: feature.getProperties('name')
          });
          this.overlayElement.nativeElement.open();*/
          $('.popover').css({ position: 'absolute', top: pixel[1], left: pixel[0] });
        } else {
          this.markerClickController.markerClickFunction(null, null);
          // this.overlayElement.nativeElement.close();
        }
      } else {
        this.markerClickController.markerClickFunction(null, null);
      }
      /*if (!features || features.length === 0) {
          this.popup.nativeElement.innerHTML = '';
          this.popup.nativeElement.hidden = true;
      }*/
    })
  }


  /*createPopup(feature) {
    feature.popup = new Ol.Popup.FramedCloud("pop",
        feature.geometry.getBounds().getCenterLonLat(),
        null,
        '<div class="markerContent">'+feature.attributes.description+'</div>',
        null,
        true,
        function() { this.controls['selector'].unselectAll(); }
    );
    //feature.popup.closeOnMove = true;
    this.map.addPopup(feature.popup);
  }*/

  /*createPopup(feature) {
    feature.popup = new Ol.Popup.FramedCloud("pop",
        feature.geometry.getBounds().getCenterLonLat(),
        null,
        '<div class="markerContent">'+feature.attributes.description+'</div>',
        null,
        true,
        function() { this.controls['selector'].unselectAll(); }
    );
    //feature.popup.closeOnMove = true;
    this.map.addPopup(feature.popup);
  }

  destroyPopup(feature) {
    feature.popup.destroy();
    feature.popup = null;
  }*/

  /* removeFeautureGrammar() {
    var features = this.vectorLayer.getSource().getFeatures();
    features.forEach((feature) => {
      this.vectorLayer.getSource().removeFeature(feature);
    });
  } */


}
