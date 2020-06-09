import { Injectable } from '@angular/core';
import { tap, map } from 'rxjs/operators';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
@Injectable()

export class Interceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

        const clonedReq = this.addHeaders(request);
        return next.handle(clonedReq).pipe(
          map((event: HttpEvent<any>) => {
            return event;
          })
        );
  }

  private addHeaders(
    request: HttpRequest<any>,
    token = null
  ): HttpRequest<any> {
    let clone: HttpRequest<any>;
    let header: HttpHeaders = request.headers;
    if (header.get('Accept') === null) {
      header = header.set('Accept', 'application/json');
    }

    if (header.get('Content-type') === null) {
      header = header.set('Content-type', 'application/json');
    }
    else {
      header = header.set('Content-type', header.get('Content-type'));
    }

    if (token !== null) {
      header = header.set('Authorization', `Bearer ${token}`);
    }

    clone = request.clone({
      headers: header,
      responseType: request.responseType
    });
    return clone;
  }
}
