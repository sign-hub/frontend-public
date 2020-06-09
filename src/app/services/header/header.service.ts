import { Injectable, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  @Output() detectPage : EventEmitter<any> = new EventEmitter();

  constructor(
    public media: MediaMatcher

  ) { }

  checkPage(value){
    this.detectPage.emit(value);
  }

  retrieveMobileQueryObject(changeDetectorRef: ChangeDetectorRef) : CustomMobileQuery{
    let ret: CustomMobileQuery = {
      mobileQuery: null,
      mobileQueryListener: null
    };
    const mobileQuery = this.media.matchMedia('(max-width: 768px)');
    const func = () => {
      changeDetectorRef.detectChanges();
    };
    mobileQuery.addListener(func);
    ret.mobileQuery = mobileQuery;
    ret.mobileQueryListener = func;
    return ret;
  }

}

export interface CustomMobileQuery{
  mobileQuery: MediaQueryList;
  mobileQueryListener: any;
}