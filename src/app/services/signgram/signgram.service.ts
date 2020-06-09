import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Constant } from 'src/app/helpers/constant/constant';

@Injectable({
  providedIn: 'root'
})
export class SigngramService {


 

  constructor(private http: HttpClient) { }

private Url:string = Constant.Url;
private SignhubUrl: string = Constant.SignhubUrl;

getGrammarList(){
   return this.http.get(this.SignhubUrl + 'grammar');
}

getGrammar(uuid: string) {
  return this.http.get(this.SignhubUrl + 'grammar?grammarId='+uuid);
}

getGrammarPart(uuid: any) {
  return this.http.get(this.SignhubUrl + 'grammarpart?grammarPartId='+uuid);
}

getGrammarByTerm(uuid: any, term: string){
  return this.http.get(this.SignhubUrl + 'grammarSearch?grammarId='+uuid+'&q='+term);
}

downloadGrammarLink(uuid: string, html? : boolean){
    let type : string;
    type = 'pdf';
    if(html){
      type = 'html';
    }
    let url = this.Url +'/downloadGrammar/'+uuid+'/'+type;
  return url;
  }

}
