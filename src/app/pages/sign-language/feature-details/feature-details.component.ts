import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, Injectable, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NavService } from 'src/app/services/navigation-streaming-tool/nav.service';

import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { SignLanguagesService } from 'src/app/services/sign-languages-list/sign-languages.service';
import { MapService } from 'src/app/services/map/map.service';

import OlFeature from 'ol/Feature';
import { Vector as VectorLayer } from 'ol/layer';
import Point from 'ol/geom/Point';
import { Style } from 'ol/style';
import Text from 'ol/style/Text';
import Fill from 'ol/style/Fill';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { BehaviorSubject } from 'rxjs';
import { MaxSelectionModel } from 'src/app/max-selection-model';


/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
// interface DataNode {
//   name: string;
//   children?: DataNode[];
// }

/**
 * Node for toc item
 */
export class TocItemNode {
  children: TocItemNode[];
  item: string;
  id: string;
  code: string;
  idFeature: string;
  description: any;
  name: any;
  areaName: string;
  areaDescription: string;
  uuid: string;
  updateDate: Date;
  featureType: string;
  personalJudgment: boolean;
  bluePrintSection: string;
}

/** Flat toc item node with expandable and level information */
export class TocItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  description: any;
  areaName: string;
  id: string;
  code: string;
  idFeature: string;
  name: any;
  featureType: string;
  personalJudgment: boolean;
  area: any;
  active: boolean;
  bluePrintSection: string;
}


@Injectable()
export class ChecklistDatabase {
  @Input()
  collapsedHeight: string;

  dataChange = new BehaviorSubject<TocItemNode[]>([]);


  treeData: any[];

  get data(): TocItemNode[] { return this.dataChange.value; }



  constructor() {
    this.initialize({});
  }

  initialize(treeList) {
    this.collapsedHeight = 'auto';
    this.treeData = treeList;
    console.log(treeList);
    // Build the tree nodes from Json object. The result is a list of `TocItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(treeList, 0);


    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TocItemNode`.
   */

  buildFileTree(obj: { [key: string]: any }, level: number): TocItemNode[] {
    const ret = new Array<TocItemNode>();
    console.log(obj);
    Object.keys(obj).forEach((key) => {
      const area = obj[key];
      const node = new TocItemNode();
      node.item = key;
      if (area !== undefined && area !== null) {
        node.children = new Array<TocItemNode>();
        area.forEach((feature) => {
          const n1 = new TocItemNode();
          n1.uuid = feature.uuid;
          n1.item = feature.name;
          n1.name = feature.name;
          n1.description = feature.featureDescription;
          n1.featureType = feature.featureType;
          n1.areaName = feature.area.name;
          n1.bluePrintSection = feature.bluePrintSection;
          n1.personalJudgment = feature.personalJudgment;

          // if (feature.options != undefined && feature.options != null) {
          //   console.log('options');
          //   n1.children = new Array<TocItemNode>();
          //   Object.keys(feature.options).forEach((key1) => {
          //     const n2 = new TocItemNode();
          //     n2.id = feature.options[key1];
          //     n2.idFeature = feature.uuid;
          //     n2.item = key1;
          //     n1.children.push(n2);
          //   });
          // }
          node.children.push(n1);
        });
      }
      ret.push(node);
    });
    return ret;
  }

  public filter(filterText: string) {
    let filteredTreeData = {};
    if (filterText) {
      for (const key in this.treeData) {
        if (this.treeData.hasOwnProperty(key)) {
          const subtree = this.treeData[key].filter(d => d.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1);
          if (subtree !== undefined && subtree !== null && subtree.length > 0) {
            filteredTreeData[key] = subtree;
          }
        }
      }
    } else {
      filteredTreeData = this.treeData;
    }
    // Build the tree nodes from Json object. The result is a list of `TocItemNode` with nested
    // file node as children.
    const data = this.buildFileTree(filteredTreeData, 0);
    // Notify the change.
    this.dataChange.next(data);
  }

  objectFilter(obj, predicate) {
    const result = {};
    let key: string | number;
    for (key in obj) {
      if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}





// const TREE_DATA: DataNode[] = [
//   {
//     name: "B. Phonology",
//     children: [
//       { name: "B1. Sublexical structures", children: [{name: "Option 1"}, {name: "Option 1"}] },
//       { name: "B2. Prosody", children: [{name: "Option 1"}, {name: "Option 1"}] },
//       { name: "B3. Phonological processes", children: [{name: "Option 1"}, {name: "Option 1"}] }
//     ]
//   },
//   {
//     name: "C. Lexicon",
//     children: [
//       {
//         name: "C1. The native lexicon",
//         children: [
//           { name: "C2.1. Borrowing from other sign languages" },
//           { name: "C2.2. Borrowing from spoken languages" }
//         ]
//       },
//       {
//         name: "C2. The non-native lexicon",
//         children: [
//           { name: "C2.1. Borrowing from other sign languages", children: [{name: "option"}]},
//           { name: "C2.2. Borrowing from spoken languages", children: [{name: "option"}] },
//           { name: "C2.3. Borrowing from spoken languages", children: [{name: "option"}] }
//         ]
//       },
//     ]
//   }
// ];



@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.scss'],
  providers: [ChecklistDatabase]
})
export class FeatureDetailsComponent implements OnInit {

  @ViewChild('overlayElement', { static: false }) overlayElement: ElementRef;
  name;
  response = false;
  urlUuid;
  public errorMsg;
  private error = false;
  // treeControl = new NestedTreeControl<DataNode>(node => node.children);
  // dataSource = new MatTreeNestedDataSource<DataNode>();
  code: string;
  LanguageDetail = {};
  vectorSource: any;
  vectorLayer: any;
  country: any = [];
  detailCoordinates: any;
  filteredData: any;
  panelOpenState: any;




  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TocItemFlatNode, TocItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TocItemNode, TocItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TocItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TocItemFlatNode>;

  treeFlattener: MatTreeFlattener<TocItemNode, TocItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TocItemNode, TocItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new MaxSelectionModel<TocItemFlatNode>(true /* multiple */);

  nodeTable: any;
  searchFilter: string;
  @Output() filter = new EventEmitter<string>();
  featureList: any[];
  checked: boolean;
  signUuid: any;
  constructor(
    private route: ActivatedRoute,
    private navService: NavService,
    private cdRef: ChangeDetectorRef,
    private language_service: SignLanguagesService,
    private mapService: MapService,
    private _database: ChecklistDatabase,

  ) {
    // this.dataSource.data = TREE_DATA;
    this.checked = false;
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TocItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      console.log(this.dataSource);
    });

  }

  getSignLanguageById(signUuid?: string) {
    let sign: string;
    if (signUuid !== undefined) {
      sign = signUuid;
    } else {
      sign = this.route.snapshot.params.uuid;
    }
    this.language_service.getSignLanguageById(sign).subscribe((data: any) => {
      this.language_service.getFeaturesMapByLanguage(data.response.code).subscribe((features: any) => {
        this.featureList = Object.entries(features);
      });
    });

  }

  ifChecked(checked) {
    if (checked[0].checked) {
      checked[0].open();
    }
  }

  getLevel = (node: TocItemFlatNode) => node.level;

  isExpandable = (node: TocItemFlatNode) => node.expandable;

  getChildren = (node: TocItemNode): TocItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TocItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TocItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TocItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TocItemFlatNode();
    flatNode.item = node.item;
    flatNode.name = node.name;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    flatNode.description = node.description;
    flatNode.id = node.id;
    flatNode.code = node.id;
    flatNode.idFeature = node.idFeature;
    flatNode.areaName = node.areaName;
    flatNode.featureType = node.featureType;
    flatNode.bluePrintSection = node.bluePrintSection;
    flatNode.personalJudgment = node.personalJudgment;


    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }


  // hasChild = (_: number, node: DataNode) =>
  //   !!node.children && node.children.length > 0;





  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      this.urlUuid = params.get('uuid');
      this.getLanguageDetail(this.urlUuid);
      this.getSignLanguageById(this.urlUuid);
    });

    this.route.paramMap.subscribe((params: Params) => {
      this.code = params.get('code');
      // this.getLanguageDetailCode(this.code);
    });

  }

  filterChanged(filterText: string) {
    this._database.filter(filterText);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }
  }

  // placeIcon() {
  //   this.language_service.getSignLanguageById(this.urlUuid).subscribe(data => {

  //   })
  // }

  setIcon(LanguageDetail) {
    if (LanguageDetail !== undefined) {
      if (LanguageDetail.coordinates != undefined && LanguageDetail.coordinates != null) {
        LanguageDetail.coordinates = LanguageDetail.coordinates.replace('[', '').replace(']', '');
        console.log(LanguageDetail.coordinates.substr(0, 9) + ' ' + LanguageDetail.coordinates.substr(11, 19));
        const coordstring = LanguageDetail.coordinates.split(',');

        this.country[0] = new OlFeature({
          center: fromLonLat([parseFloat(coordstring[1]), parseFloat(coordstring[0])]),
          geometry: new Point(fromLonLat([parseFloat(coordstring[1]), parseFloat(coordstring[0])])),

        }, { description: LanguageDetail.name })
        this.country[0].setStyle(new Style({
          text: new Text({
            font: '20px cinicon',
            text: '1',/* rappresenta il pallino circolare */
            fill: new Fill({
              color: '#000000'
            })
          })
        }));
      }


      this.vectorSource = new VectorSource({
        features: this.country
      });

      this.vectorLayer = new VectorLayer({
        source: this.vectorSource
      });

      this.mapService.setIcon(this.vectorLayer);
    }
  }





  getLanguageDetailCode(code) {
    return this.language_service.getLanguageDetail(code).subscribe(
      data => {
        this.LanguageDetail = data;
        console.log(data);
      }
    );
  }

  getLanguageDetail(uuid) {
    return this.language_service.getSignLanguageById(uuid).subscribe(
      res => {
        this.response = true;
        this.LanguageDetail = res;
        this.detailCoordinates = res['response'].coordinates;
        // this.setIcon(res);
        // console.log(res);
        this.language_service.getFeaturesMapByLanguage(res['response'].code).subscribe(
          feat => {

            this._database.initialize(feat);
            console.log(feat);
            this.nodeTable = feat;
            /* this.mapService.emptyMapDetail(this.detailCoordinates); */
            this.setIcon(this.LanguageDetail['response']);
            this.mapService.emptyMapDetail(this.detailCoordinates);

            // this.mapService.emptyMapDetail(this.detailCoordinates);
            this.setIcon(this.LanguageDetail['response']);
            console.log('map-loaded again');


          },
          err => {
            this.error = true;
            this.errorMsg = err;
          }
        )
      },
      err => {
        this.error = true;
        this.errorMsg = err;
      }
    )

  }

  buildFileTree(obj: { [key: string]: any }, level: number): TocItemNode[] {
    let ret = new Array<TocItemNode>();
    console.log(obj);
    Object.keys(obj).forEach((key) => {
      let area = obj[key];
      const node = new TocItemNode();
      node.item = key;
      if (area != undefined && area != null) {
        node.children = new Array<TocItemNode>();
        area.forEach((feature) => {
          const n1 = new TocItemNode();
          n1.id = feature.uuid;
          n1.item = feature.name;
          n1.description = feature.featureDescription;
          if (feature.options != undefined && feature.options != null) {
            n1.children = new Array<TocItemNode>();
            Object.keys(feature.options).forEach((key1) => {
              const n2 = new TocItemNode();
              n2.id = feature.options[key1];
              n2.idFeature = feature.uuid;
              n2.item = key1;
              n1.children.push(n2);
            });
          }
          node.children.push(n1);
        });
      }
      ret.push(node);
    });
    return ret;
  }




}


