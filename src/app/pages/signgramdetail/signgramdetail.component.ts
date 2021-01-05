import { Component, OnInit, ChangeDetectorRef, OnDestroy, Injectable, Input, ViewEncapsulation, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Grammar } from 'src/app/components/grammar';
import { SigngramService } from 'src/app/services/signgram/signgram.service';
import { CustomMobileQuery, HeaderService } from 'src/app/services/header/header.service';
import { GrammarPart } from 'src/app/components/grammar-part';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject } from 'rxjs';
import { notDeepEqual } from 'assert';
import { timingSafeEqual } from 'crypto';

declare var require: any
const FileSaver = require('file-saver');
/**
 * Node for toc item
 */
export class TocItemNode {
  children: TocItemNode[];
  item: string;
  id: string;
  idFeature: string;
  uuid: string;
  name: string;
  isSearched: boolean;
  chapter: string;
}

/** Flat toc item node with expandable and level information */
export class TocItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  id: string;
  idFeature: string;
  uuid: string;
  name: string;
  isSearched: boolean;
  chapter: string;
}

Injectable()
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
    const data = this.buildFileTree(treeList, 0, null, null, null);


    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TocItemNode`.
   */


  buildFileTree(obj: { [key: string]: any }, level: number, filterText: string, filterUuid: string, filterChapter: string): TocItemNode[] {
    let ret = new Array<TocItemNode>();
    console.log(obj);
    let object = Object.assign({}, obj);
    console.log(object);


    let ret1 = new Array<TocItemNode>();

    Object.keys(object).forEach((key) => {
      let area = obj[key];

      //  console.log(area);
      const node = new TocItemNode();
      node.item = area.name;
      node.name = area.name;
      node.id = area.id;
      node.uuid = area.uuid;
      if (area !== undefined && area != null) {
        node.children = new Array<TocItemNode>();
        this.buildNode(area.parts, node, filterText, filterUuid, filterChapter);
      }
      node.isSearched = false;
      if ((filterText && node.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1)
        || (filterUuid && node.uuid.toLocaleLowerCase() === filterUuid.toLocaleLowerCase())
        || (filterChapter && node.chapter.toLocaleLowerCase() === filterChapter.toLocaleLowerCase())) {
        node.isSearched = true;
        // ret1.push(node);
      }
      //    else{
      //   ret1.push(node);
      // }
      if ((filterChapter === null && filterText == null && filterUuid == null) || node.isSearched ||
        node.children.length > 0) {
        ret1.push(node);
      }
    });

    console.log(ret1);
    return ret1;

  }

  private buildNode(parts, parent, filterText: string, filterUuid: string, filterChapter: string) {
    Object.keys(parts).forEach((key) => {
      let subobj = parts[key];
      const n1 = new TocItemNode();
      n1.item = subobj.name;
      n1.name = subobj.name;
      n1.id = subobj.id;
      n1.uuid = subobj.uuid;
      n1.isSearched = false;
      n1.chapter = subobj.chapter;
      if ((filterText && n1.name.toLocaleLowerCase().indexOf(filterText.toLocaleLowerCase()) > -1)
        || (filterUuid && n1.uuid.toLocaleLowerCase() == filterUuid.toLocaleLowerCase())
        || (filterChapter && n1.chapter.toLocaleLowerCase() === filterChapter.toLocaleLowerCase())) {
        n1.isSearched = true;
      }
      this.buildNode(subobj.parts, n1, filterText, filterUuid, filterChapter);
      if ((filterText == null && filterUuid == null && filterChapter == null) || n1.isSearched || (n1.children != undefined && n1.children != null && n1.children.length > 0)) {

        if (parent.children == undefined || parent.children == null)
          parent.children = new Array<TocItemNode>();
        parent.children.push(n1);
      }

    });
  }

  public filter(filterText: string, filterUuid: string, filterChapter: string) {

    const data = this.buildFileTree(this.treeData, 0, filterText, filterUuid, filterChapter);
    // Notify the change.
    this.dataChange.next(data);
  }

  objectFilter(obj, key, predicate) {
    var result = {};


    if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
      result[key] = obj[key];
    }

    return result;
  }

}



@Component({
  selector: 'app-signgramdetail',
  templateUrl: './signgramdetail.component.html',
  styleUrls: ['./signgramdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ChecklistDatabase]
})
export class SigngramdetailComponent implements OnInit, OnDestroy {
  uuid: any;
  grammar: Grammar;
  isLoading: boolean;
  grammarTitle: any;
  grammarUuid: any;
  grammarDownloadLink: string;
  customMobileQuery: CustomMobileQuery;
  grammarPart: any;
  opened: boolean;
  hasTopic: boolean;

  @ViewChild('centerContainer', { static: false }) centerContainer: ElementRef;

  public error = false;
  private errorMsg;

  Aree: any;

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


  @Input('matTreeNodePaddingIndent')
  @Input('vocabulary')
  indent: number;
  isFiltered: boolean;
  grammarByTerms: Array<any>;
  dataSourceTerms: any;
  topic: any;
  keepOpen: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signgramservice: SigngramService,
    private headerService: HeaderService,
    private _database: ChecklistDatabase,
    changeDetectorRef: ChangeDetectorRef) {
    this.customMobileQuery = this.headerService.retrieveMobileQueryObject(changeDetectorRef);
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TocItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
      // console.log(this.dataSource);
    });
  }
  getLevel = (node: TocItemFlatNode) => node.level;

  isExpandable = (node: TocItemFlatNode) => node.expandable;

  getChildren = (node: TocItemNode): TocItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TocItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TocItemFlatNode) => _nodeData.item === '';

  transformer = (node: TocItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TocItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children && node.children.length > 0;
    flatNode.id = node.id;
    flatNode.uuid = node.uuid;
    flatNode.isSearched = node.isSearched;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }



  ngOnInit() {
    this.isFiltered = false;
    this.keepOpen = false;
    this.route.paramMap.subscribe(params => {
      this.uuid = params.get('uuid');
      console.log(this.uuid);
      if (this.uuid == undefined || this.uuid == null) {
        const navigationExtras: NavigationExtras = {
        };
        this.router.navigate(['/home/grammar_tool/grammarlist'], navigationExtras);
        return;
      }
      this.grammar = new Grammar();
      this.isLoading = true;
      this.signgramservice.getGrammar(this.uuid).subscribe(
        res => {
          // console.log(res);
          // console.log(res['status']);
          if (res['status'] === 'OK') {
            this.grammar = res['response'];
            console.log(this.grammar);

            this._database.initialize(this.grammar.parts);

            this.grammarTitle = this.grammar.grammarName;
            this.grammarUuid = this.grammar.uuid;
            if (params.get('link') != undefined &&
              params.get('link') != null && params.get('link') != '') {
              console.log(params.get('link'));
              this.getGrammarPart({ uuid: params.get('link') }, true);

            }
          } else {
            console.error('Server error', res['errors']);
          }
          this.isLoading = false;
        }



      );

      this.opened = !this.customMobileQuery.mobileQuery.matches;
      this.hasTopic = false;
      //  this.getGrammarFeatures(this.uuid);


    })
  }

  expandParents(node: any) {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        this.treeControl.expand(currentNode);
        if (this.getLevel(currentNode) === 0) break;
      }
    }
  }


  getTid(event) {
    console.log(event.target);
    console.log(event);
    if (event.target.tagName === 'A' && event.target.getAttribute('data')) {
      let uuid = event.target.getAttribute('data');
      this.getGrammarPart({ 'uuid': uuid }, false);

      for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
        if (this.treeControl.dataNodes[i].uuid == uuid) {
          this.expandParents(this.treeControl.dataNodes[i]);
        }
      }
    } else if (event.target.tagName == 'MARK') {
      let thisTid = event.srcElement.getAttribute('tid');
      this.setVacabularyTopic(thisTid);
    } else if (event.srcElement.parentNode.tagName == 'MARK') {
      let thisTid = event.srcElement.parentNode.getAttribute('tid');
      this.setVacabularyTopic(thisTid);
    } else if (event.srcElement.parentNode.parentNode.tagName == 'MARK') {
      let thisTid = event.srcElement.parentNode.parentNode.getAttribute('tid');
      this.setVacabularyTopic(thisTid);
    }
    else if (event.srcElement.parentNode.parentNode.parentNode.tagName == 'MARK') {
      let thisTid = event.srcElement.parentNode.parentNode.parentNode.getAttribute('tid');
      this.setVacabularyTopic(thisTid);
    }
    // this.grammarPart.topics[event.target]
  }

  setVacabularyTopic(tid) {
    return; // in questo modo disabilito il glossary
    if (!this.keepOpen) {
      this.hasTopic = !this.hasTopic;
    }
    this.topic = {};
    this.topic = this.grammarPart.options.topics[tid];

  }

  filterChanged(filterText: string, filterUuid: string, filterChapter: string) {

    if (filterText && filterText.trim().length >= 3) {
      this.isFiltered = true;
      this._database.filter(filterText, null, null);
      this.treeControl.expandAll();
    } else if (filterUuid && filterUuid.trim().length >= 3) {
      this.isFiltered = true;
      this._database.filter(null, filterUuid, null);
      this.treeControl.expandAll();
    } else if (filterChapter && filterChapter.trim().length >= 3) {
      this.isFiltered = true;
      this._database.filter(null, null, filterChapter);
      this.treeControl.expandAll();
    }
    else if (this.isFiltered) {
      this._database.filter(null, null, null);
      this.isFiltered = false;
      this.treeControl.collapseAll();
    }

  }

  resetFilter() {
    this._database.filter(null, null, null);
    this.isFiltered = false;
    this.treeControl.collapseAll();
  }


  resetAllFilters() {
    this.resetFilter();
    this.grammarByTerms = null;

  }

  getGrammarPart(grammar, initialize) {

    const uuid = grammar.uuid;
    this.grammarPart = new GrammarPart();
    this.isLoading = true;
    this.route.queryParams.subscribe(grammar => {
      this.signgramservice.getGrammarPart(uuid).subscribe(
        res => {
          if (res['status'] === 'OK') {
            this.grammarPart = res['response'];
            if (initialize) {
              this._database.initialize(this.grammarPart);
            }
            setTimeout(() => {
              //this.centerContainer.nativeElement.click();
              this.centerContainer.nativeElement.focus();
            }, 200)
            //this.grammarTitle = this.grammarPart.name;


            console.log(this.grammarPart);

          } else {
            console.error('Server error', res['errors']);
          }

          this.isLoading = false;


        });
    });
  }



  getGrammarPartByUuid(uuid, searchUid?: Boolean) {
    this.grammarPart = new GrammarPart();
    this.isLoading = true;
    this.route.queryParams.subscribe(grammar => {
      this.signgramservice.getGrammarPart(uuid).subscribe(
        res => {
          if (res['status'] === 'OK') {
            this.grammarPart = res['response'];
            //this._database.initialize(this.grammarPart);
            //this.grammarTitle = this.grammarPart.name;
            setTimeout(() => {
              //this.centerContainer.nativeElement.click();
              this.centerContainer.nativeElement.focus();
            }, 200)
            /*Todo controllare che ci sono options*/
            if (this.grammarPart.options != null) {
              if (this.grammarPart.options.topics && this.grammarPart.options.topics != null) {
                this.grammarPart.options.topics = JSON.parse(this.grammarPart.options.topics);
              } else {
                this.grammarPart.options.topics.word = "topic not in vocabulary",
                  this.grammarPart.options.topics.description = ""
              }
            }
            console.log(this.grammarPart);
          } else {
            console.error('Server error', res['errors']);
          }

          this.isLoading = false;


        });
    });
    if (searchUid) {
      this.filterChanged(null, uuid, null);
    }
  }

  getFilteresGrammarPartByUuid(uuid) {
    this.grammarPart = new GrammarPart();
    this.isLoading = true;

    this.signgramservice.getGrammarPart(uuid).subscribe(
      res => {
        if (res['status'] === 'OK') {
          this.grammarPart = res['response'];
          //this._database.initialize(this.grammarPart);
          this.grammarTitle = this.grammarPart.name;
          // console.log(this.uuid);
          setTimeout(() => {
            //this.centerContainer.nativeElement.click();
            this.centerContainer.nativeElement.focus();
          }, 200)
        } else {
          console.error('Server error', res['errors']);
        }

        this.isLoading = false;
      });

    this.filterChanged(null, uuid, null);

  }

  onEnter(terms, event) {
    if (event.keyCode === 13) {
      this.searchTerms(terms);
    }
  }


  searchTerms(term) {
    //console.log('grammar uuid'+ this.uuid) + ' searche term '+ term;
    if (!term || term.trim() == '')
      return;

    this.signgramservice.getGrammarByTerm(this.uuid, term).subscribe(
      ret => {
        if (ret) {
          if (ret['status'] == 'OK')
            this.grammarByTerms = ret['response'];
          this.dataSourceTerms = this.grammarByTerms;
        }
      });


  }

  downloadFile(uuid, filename) {
    const fileUrl = this.signgramservice.downloadGrammarLink(uuid);
    const fileName = filename;
    FileSaver.saveAs(fileUrl, fileName);
  }


  ngOnDestroy(): void {
    this.customMobileQuery.mobileQuery.removeListener(this.customMobileQuery.mobileQueryListener);
  }

  toggleSidenav() {
    this.opened = !this.opened;
  }


  goToFront() {
    this.grammarPart = null;
  }

}
