import { Component, OnInit, Inject, Input, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { MatTableDataSource } from '@angular/material/table'
export interface PeriodicElement {
  position: number,
  Feature: string;
  Value: string;
  Media: string;
  Personal: string;
}

// export interface DialogData {
//   animal: string;
//   name: string;
// }

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  @Input() nodeTable;
  @Input() areaDescription;
  @Input() filter;

  displayedColumns: any;
  @Input() datasource: MatTableDataSource<any>;
  @Input() data;
  constructor(public dialog: MatDialog) {
    console.log(this.nodeTable);
    this.displayedColumns = ['Feature',
      // 'Value',
      'Chapter',
      'Personal'];
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.datasource = new MatTableDataSource<any>(this.data);
  }


  /* openDialog(): void {
    const dialogRef = this.dialog.open(VideoDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  } */


  ngOnChanges(changes: SimpleChanges) {
    if (changes['filter']) {
      this.nodeTable = changes['filter'].currentValue;
      this.onFilter();
    }
  }


  applyFilter(filterValue: string) {
    if (filterValue) {
      this.datasource.filter = filterValue.trim().toLowerCase();
    }
  }

  onFilter() {
    this.applyFilter(this.filter);
  }
  // export class DialogOverviewExampleDialog {

  //   constructor(
  //     public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
  //     @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  //   onNoClick(): void {
  //     this.dialogRef.close();
  //   }

  // }
}
