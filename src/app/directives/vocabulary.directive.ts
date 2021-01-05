/*
import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({selector: '[tid]'})
export class Vocabulary {
  @Output() viewTopic : EventEmitter<any> = new EventEmitter();
  voc: any;
  constructor(
    private el: ElementRef,


    ) { }

  @HostListener('mouseenter') onMouseEnter() {
    let tid = this.el.nativeElement.getAttribute('tid')
    console.log('vocabulary touched', tid);
    this.highlight('yellow');
  }
  @HostListener('click') onClick() {
    let tid = this.el.nativeElement.getAttribute('tid')

    this.highlight('yellow');
    this.viewTopic.emit(tid);
    this.voc = tid;

    console.log('Host Element Clicked', tid);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
} */
