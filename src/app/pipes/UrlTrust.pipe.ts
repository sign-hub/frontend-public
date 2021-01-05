import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'urlTrust',
  pure: false,
})
export class UrlTrustPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(content);
  }
}
