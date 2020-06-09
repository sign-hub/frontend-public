import { Injectable } from '@angular/core';
import { Constant } from 'src/app/helpers/constant/constant';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  constructor(private http : HttpClient) { }

  private Url: string = Constant.Url;


  sendContactForm(form){
    return this.http.post(this.Url + 'requestRegistration', form);
  }
}
