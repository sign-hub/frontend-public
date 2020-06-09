import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterlist'
})
export class FilterlistPipe implements PipeTransform {

  transform(value: any, args: any, what: any, whatOb?: any): any {
    if (!args) {
      return value;
    }
    if (whatOb) {
      return value.filter(
        item => item[what][whatOb].toLowerCase().indexOf(args.toLowerCase()) > -1);
    } else {
      return value.filter(
        item => item[what].toLowerCase().indexOf(args.toLowerCase()) > -1);
    }
  }
}
