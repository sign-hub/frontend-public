import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Constant } from "../../helpers/constant/constant";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  
  private baseUrl: string = Constant.baseUrl;
  private baseUrlDemo: string = Constant.baseUrlDemo;
  private baseUrlContent: string = Constant.content;
  private isOrtolangDemo: boolean = Constant.isOrtolangDemo;

  private ortolangUrl: string;

  constructor(private http: HttpClient) {
    if(this.isOrtolangDemo)
      this.ortolangUrl = this.baseUrlDemo;
    else
      this.ortolangUrl = this.baseUrl;
  }

  getRequest(endPoint) {
      return this.http.get(this.ortolangUrl + endPoint);
  }

  postRequest(endPoint, body): Observable<any> {
    return this.http.post<any>(this.ortolangUrl + endPoint, body);
  }

  deleteRequest(endpoint, id){
    return this.http.delete(this.ortolangUrl+ endpoint, id)
  }

  putRequest(endpoint, id){
    return this.http.put(this.ortolangUrl+ endpoint, id)
  }

  putRequestFriends(endPoint, id, status){
    return this.http.put(this.ortolangUrl + endPoint, id, status)
  }

  getRequestContent(endPoint){
    return this.http.get(this.ortolangUrl+this.baseUrlContent + endPoint);
  }
}
