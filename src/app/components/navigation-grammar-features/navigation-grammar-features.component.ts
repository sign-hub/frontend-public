import { MapService } from 'src/app/services/map/map.service';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, OnInit, ViewEncapsulation, Output, Input } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { SignLanguagesService } from 'src/app/services/sign-languages-list/sign-languages.service';
import { isArray } from 'util';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { keyframes } from '@angular/animations';
import { MaxSelectionModel } from 'src/app/max-selection-model';
import { EventEmitter } from 'events';
import { NavigationGrammarToolService } from 'src/app/services/navigation-grammar-tool/navigation-grammar-tool.service';
import { MatStepperIcon } from '@angular/material';
import { Router } from '@angular/router';

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
  uuid: any;
  feature: boolean;
}

/** Flat toc item node with expandable and level information */
export class TocItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  description: any;
  id: string;
  code: string;
  idFeature: string;
  uuid: any;
  feature: boolean;
}


/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a toc item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
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
    // console.log(treeList);
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
    let ret = new Array<TocItemNode>();
    // console.log(obj);
    Object.keys(obj).forEach((key) => {
      let part = obj[key];
      const node = new TocItemNode();
      node.item = part.name;
      node.name = part.name;
      node.uuid = part.uuid;
      node.feature = false;
      const childrenParts = part.parts;
      if (childrenParts !== undefined && childrenParts != null) {
        this.buildNode(childrenParts, node);
      }
      //console.log(node);
      ret.push(node);
    });
    return ret;
  }
  private buildNode(childrenParts: any, node) {
    if (node.children === undefined) {
      node.children = new Array<TocItemNode>();
    }
    if (childrenParts !== undefined) {
      Object.keys(childrenParts).forEach(key => {
        const subObj = childrenParts[key];
        const part = new TocItemNode();
        part.item = subObj.name;
        part.name = subObj.name;
        part.uuid = subObj.uuid;
        part.feature = false;
        if (subObj.parts !== undefined && subObj.parts !== null) {
          this.buildNode(subObj.parts, part);
          if (subObj.features !== undefined && subObj.features !== null) {
            if (subObj.features.length !== 0) {
              this.buildFeatures(subObj.features, part);
            }
          }
        }
        /* if (node.children == undefined || node.children == null) {
          node.children = new Array<TocItemNode>();
        } */
        node.children.push(part);
      });
    }
  }

  private buildFeatures(features, node) {
    if (node.children === undefined) {
      node.children = new Array<TocItemNode>();
    }

    if (features !== undefined || features != null) {
      const feature = new TocItemNode();
      feature.children = new Array<TocItemNode>();
      const featureName = node.name;
      feature.item = featureName.substring(featureName.indexOf(' ') + 1, featureName.length) + ' features';
      feature.feature = false;
      Object.keys(features).forEach(key => {
        const subObj = features[key];
        const f1 = new TocItemNode();
        f1.id = subObj.uuid;
        f1.item = subObj.name;
        f1.description = subObj.featureDescription;
        f1.feature = true;
        f1.children = new Array<TocItemNode>();
        Object.keys(subObj.options).forEach((key1) => {
          const n2 = new TocItemNode();
          n2.id = subObj.options[key1];
          n2.idFeature = subObj.uuid;
          n2.item = key1;
          f1.children.push(n2);
        });
        feature.children.push(f1);

        /* if (node.children === undefined || node.children == null) {
          node.children = new Array<TocItemNode>();
        } */
      });
      node.children.push(feature);
    }
  }

  public filter(filterText: string, notOnlyFeatures) {
    let filteredTreeData = {};
    if (filterText) {
      filteredTreeData = this.search(JSON.parse(JSON.stringify(this.treeData)), filterText, notOnlyFeatures);
    } else {
      filteredTreeData = this.treeData;
    }
    // Build the tree nodes from Json object. The result is a list of `TocItemNode` with nested
    // file node as children.
    const data = this.buildFileTree(filteredTreeData, 0);
    // Notify the change.
    this.dataChange.next(data);
  }

  public search(items: any[], term: string, notOnlyFeatures: boolean): any[] {
    return items.reduce((acc, item) => {
      let toAdd = false;
      if (notOnlyFeatures && this.contains(item.name, term)) {
        toAdd = true;
      }
      if (item.features && item.features.length > 0) {
        let feat = [];
        for (let index = 0; index < item.features.length; index++) {
          const element = item.features[index];
          if (this.contains(element.name, term)) {
            toAdd = true;
            feat.push(element);
            break;
          }
        }
        item.features = feat;
      }

      if (item.parts && item.parts.length > 0) {
        let newItems = this.search(item.parts, term, notOnlyFeatures);
        if (newItems.length > 0) {
          toAdd = true;
          item.parts = [];
          for (let index = 0; index < newItems.length; index++) {
            item.parts.push(newItems[index]);
          }
        } else {
          item.parts = [];
        }
      }

      if (toAdd)
        acc.push(item);


      /*if (this.contains(item.name, term)) {
        acc.push(item);
      } else if (item.features && item.features.length > 0) {
        for (let index = 0; index < item.features.length; index++) {
          const element = item.features[index];
          if (this.contains(element.name, term)) {
            acc.push(item);
            break;
          }
        }
      } else if (item.parts && item.parts.length > 0) {
        let newItems = this.search(item.parts, term);

        if (newItems.length > 0) {
          item.parts = [];
          for (let index = 0; index < newItems.length; index++) {
            item.parts.push(newItems[index]);
          }
          acc.push(item);
        }
      }*/

      return acc;
    }, []);
  }

  public searchOnlyFeatures(items: any[], term: string): any[] {
    return items.reduce((acc, item) => {
      let toAdd = false;
      if (item.features && item.features.length > 0) {
        let feat = [];
        for (let index = 0; index < item.features.length; index++) {
          const element = item.features[index];
          if (this.contains(element.name, term)) {
            toAdd = true;
            feat.push(element);
            break;
          }
        }
        item.features = feat;
      }

      if (item.parts && item.parts.length > 0) {
        let newItems = this.searchOnlyFeatures(item.parts, term);
        if (newItems.length > 0) {
          toAdd = true;
          item.parts = [];
          for (let index = 0; index < newItems.length; index++) {
            item.parts.push(newItems[index]);
          }
        } else {
          item.parts = [];
        }
      }

      if (toAdd)
        acc.push(item);

      return acc;
    }, []);
  }

  public contains(text: string, term: string): boolean {
    return text.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  objectFilter(obj, predicate) {
    var result = {}, key;
    for (key in obj) {
      if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
        result[key] = obj[key];
      }
    }
    return result;
  }
}



@Component({
  selector: 'app-navigation-grammar-features',
  templateUrl: './navigation-grammar-features.component.html',
  styleUrls: ['./navigation-grammar-features.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ChecklistDatabase]
})
export class NavigationGrammarFeaturesComponent implements OnInit {
  step: number = 0;
  changeSome: any;
  relation = [
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature1',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature2',
          'name': 'Option1'
        }
      ],
      languages: [
        {
          'id': 1,
          'code': 'IT',
          'codeLanguage': 'ise',
          'name': 'Italian Lis',
          'coords': { 'lon': 14.2429, 'lat': 40.8537 }
        }
      ],
      icon: {}
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature2',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature3',
          'name': 'Option2'
        }
      ],
      languages: [
        {
          'id': 1,
          'code': 'EN',
          'codeLanguage': 'ase',
          'name': 'English Lis',
          'coords': { 'lon': -0.1276, 'lat': 51.5076 }
        },
        {
          'id': 1,
          'code': 'FR',
          'codeLanguage': 'fsl',
          'name': 'French Lis',
          'coords': { 'lon': 2.3469, 'lat': 48.8589 }
        }
      ]
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature1',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature3',
          'name': 'Option1'
        }
      ],
      languages: [
      ],
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature1',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature2',
          'name': 'Option1'
        }
      ],
      languages: [
        {
          'id': 1,
          'code': 'IT',
          'codeLanguage': 'deu',
          'name': 'German Lis',
          'coords': { 'lon': 11.5418, 'lat': 48.155 }
        }
      ]
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature2',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature3',
          'name': 'Option2'
        }
      ],
      languages: [
        {
          'id': 1,
          'code': 'IT',
          'codeLanguage': 'ssp',
          'name': 'Spanish Lis',
          'coords': { 'lon': -3.7038, 'lat': 40.4783 }
        }
      ]
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature1',
          'name': 'Option1'
        },
        {
          'id': 1,
          'featureId': 'Feature3',
          'name': 'Option1'
        }
      ],
      languages: []
    },
    {
      options: [
        {
          'id': 1,
          'featureId': 'Feature3',
          'name': 'Option2'
        },
        {
          'id': 1,
          'featureId': 'Feature1',
          'name': 'Option1'
        }
      ],
      languages: [
        {
          'id': 1,
          'code': 'ARG',
          'codeLanguage': 'aed',
          'name': 'Arg Lis',
          'coords': { 'lon': -58.4333, 'lat': -34.6161 }
        }
      ]
    }
  ]

  allSelectedValues: any = [];
  public selected = [];
  //1=>cirle,2=>diamond,3=>triangle,4=>square,5=>pentagon
  //da 1 a 5 e da a a y
  shapes = [1, 2, 3, 4, 5];
  pattern = ['circle', 'line', 'minus', 'plus', 'cross'];
  color = ['black', 'blue', 'green', '#fdc400', 'red', 'purple', 'orange', 'gray', 'skyblue', 'darkblue'];
  iconArray = ['1', '2', '3', '4', '5', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'L', 'M', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y'];


  public error = false;
  public errorMsg;
  relationFeature;
  private selectOnlyLeaf = true;
  public nFeature = [];
  public checkSubmit = 0.3;
  public isChecked: boolean = false;
  private coordinate = [];

  public isDisabled: boolean = true;
  notOnlyFeatures: boolean = true;

  Aree: any;
  icon = {};
  allValues: any;
  featureSelected = [];
  opened: boolean;
  controllerGrammarFeauture: any;

  ngOnInit() {
    this.setIcon();
    // console.log('navigation')
    //this.getGrammarFeatures();
    this.getFeaturesTree();
    this.deselectNode();
    this.getGrammarFeaturesSelected();
    this.getGrammarFeaturesRetrieved();
    this.opened = true;
  }


  //assegnazione di 1 icona per ogni relazione
  setIcon() {
    let j = 0;
    for (let i = 0; i < this.relation.length; i++) {
      if (j == 0 && j % this.color.length == 0)
        j++;
      this.relation[i].icon = this.getIcon(j);
      j++;
    }
  }

  getIcon(i) {
    return {
      'color': this.color[i % this.color.length],
      'text': this.iconArray[i]
    };
  }

  languageDetail(uuid) {
    this.grammar_service.getSignLanguageById(uuid).subscribe(
      (data: any) => {
        this.router.navigate(['/sign-language/feature-details/', data.response.uuid]);
      }
    )
  }

  /*  getGrammarFeatures() {
     return this.grammar_service.getGrammarFeatures().subscribe(
       data => {
         this.Aree = data
         this._database.initialize(this.Aree);
         //this._database.initialize(TREE_DATA);
         console.log('data >>>>>>>>>>>>>>>>>>>>', data);
       },
       err => {
         this.error = true;
         this.errorMsg = err;
       });
   } */
  getFeaturesTree() {
    return this.grammar_service.getFeaturesTree().subscribe(
      (data: any) => {
        this.Aree = data.parts;
        this._database.initialize(this.Aree);
        //this._database.initialize(TREE_DATA);
        // console.log('data >>>>>>>>>>>>>>>>>>>>', data);
      },
      err => {
        this.error = true;
        this.errorMsg = err;
      });
  }

  //coordinate di ogni linguaggio
  getCoordinate() {
    this.coordinate = new Array();
    for (var i = 0; i < this.relation.length; i++) {
      for (var k = 0; k < this.relation[i].languages.length; k++) {
        this.coordinate.push({
          'coordinate': this.relation[i].languages[k].coords,
          'icone': this.relation[i].icon,
          'name': this.relation[i].languages[k].name
        }
        )
      }
    }
    this.navigationGrammar.coord.emit(this.coordinate);
    this.changeSome = {
      relation: this.relation
    }
  }



  OnSubmit() {
    /*  if (this.mapService.vectorSource) {
       this.mapService.layer.clear(); // tile layer
       this.mapService.vectorLayer.clear();
     } */
    this.selected = [];
    this.SelectedOption();
    var last = this.selected.length - 1;
    this.navigationGrammar.grammarFeatures.emit(this.selected[last]);
    //this.getCoordinate();
    this.step = 1;
  }

  relationRetrieved() {
    //this.selected = [];
    //this.SelectedOption();
    //var last = this.selected.length - 1;
    //this.navigationGrammar.grammarFeatures.emit(this.selected[last]);
    this.setIcon();
    this.getCoordinate();
    this.step = 1;
  }

  getGrammarFeaturesSelected() {
    return this.navigationGrammar.featureSelected.subscribe(
      data => {
        this.featureSelected = data
        console.log(this.featureSelected);
      },
      err => {
        console.log(err);
      });
  }

  getGrammarFeaturesRetrieved() {
    return this.navigationGrammar.featureRetrieved.subscribe(
      data => {
        //this.featureSelected = data
        this.relation = data;
        console.log(data);
        this.relationRetrieved();
      },
      err => {
        console.log(err);
      });
  }

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


  constructor(
    private router: Router,
    private _database: ChecklistDatabase,
    private navigationGrammar: NavigationGrammarToolService,
    private grammar_service: SignLanguagesService,
    private mapService: MapService
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TocItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.checklistSelection.setLevel(2);

    this.checklistSelection.setMax(3);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      // console.log(this.dataSource);
    });

    this.navigationGrammar.setCurrentController(this);
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
    flatNode.level = level;
    flatNode.expandable = !!node.children && node.children.length > 0;
    flatNode.description = node.description;
    flatNode.id = node.id;
    flatNode.uuid = node.uuid;
    flatNode.code = node.id;
    flatNode.idFeature = node.idFeature;
    flatNode.feature = node.feature;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }


  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TocItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  deselectNode() {
    this.navigationGrammar.deleteFeatures.subscribe(
      data => {
        var nodo: TocItemFlatNode = data;
        this.checklistSelection.deselect(nodo);
      }
    );

  }


  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TocItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the toc item selection. Select/deselect all the descendants node */
  tocItemSelectionToggle(node: TocItemFlatNode): void {
    if (this.treeControl.getLevel(node) === 3) {
      return;
    }
    // this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    descendants.forEach(value => {
      this.checklistSelection.toggle(value);
    });
    //this.checklistSelection.isSelected(node) ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);
    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.submit();
  }

  /** Toggle a leaf toc item selection. Check all the parents to see if they changed */
  tocLeafItemSelectionToggle(node: TocItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.SelectedOption();
    this.submit();
  }


  submit() {
    var selected = this.checklistSelection.getNumSelected();
    if (selected == 0) {
      this.checkSubmit = 0.3;
      this.isChecked = false;
    } else {
      this.checkSubmit = 1;
      this.isChecked = true;
    }
  }



  SelectedOption() {
    this.selected.push(this.checklistSelection.getSelected());
    console.log('option selected', this.selected);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TocItemFlatNode): void {
    let parent: TocItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TocItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  deselectAll() {
    for (let node of this.treeControl.dataNodes) {
      if (this.checklistSelection.isSelected(node)) {
        this.checklistSelection.toggle(node);
      }
    }
  }
  /* Get the parent node of a node */
  getParentNode(node: TocItemFlatNode): TocItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        console.log(currentNode);

        console.log(this.nFeature);
        return currentNode;
      }
    }
    return null;
  }

  checkDisableParent(node) {

    const descendants = this.treeControl.getDescendants(node);
    if (descendants.some(childNode => this.checklistSelection.isSelected(childNode))) {
      return false;
    }
    if (this.checklistSelection.isSelected(node)) {
      return false;
    }
    if (this.checklistSelection.getFeatureSelected(node)) {
      return false;
    }
    if (this.checklistSelection.getNumSelectedLevel() < 3) {
      return false;
    }
    return true;
  }

  checkDisabled(node) {
    if (this.checklistSelection.isSelected(node)) {
      return false;
    }
    if (this.checklistSelection.getFeatureSelected(node)) {
      return false;
    }
    if (this.checklistSelection.getNumSelectedLevel() < 3) {
      return false;
    }
    return true;
  }

  notOnlyFeaturesToggle() {
    this.notOnlyFeatures = !this.notOnlyFeatures;
    this.resetFilter();
  }

  resetFilter() {
    this._database.filter(null, null);
  }

  filterChanged(filterText: string, notOnlyFeatures: boolean) {
    this._database.filter(filterText, notOnlyFeatures);
    if (filterText) {
      this.treeControl.expandAll();
    } else {
      this.treeControl.collapseAll();
    }

  }

  // /** Select the category so we can insert the new item. */
  // addNewItem(node: TocItemFlatNode) {
  //   const parentNode = this.flatNodeMap.get(node);
  //   this._database.insertItem(parentNode!, '');
  //   this.treeControl.expand(node);
  // }

  // /** Save the node to database */
  // saveNode(node: TocItemFlatNode, itemValue: string) {
  //   const nestedNode = this.flatNodeMap.get(node);
  //   this._database.updateItem(nestedNode!, itemValue);
  // }

}
