import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators  } from '@angular/forms';
import { HeaderService } from 'src/app/services/header/header.service';
import { ContactsService } from 'src/app/services/contact/contacts.service';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  private sendForm;
  public isSuccess = false; 
  public check_submit_btn
  public responseData;
  public errorMsg;
  public invalidForm;
  public emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
  private error = false;
  submitted: boolean = false;
  tools = [
    {value: 'TESTING', name:'Testing'},
    {value: 'ATLAS', name:'Atlas'},
    {value: 'GRAMMAR', name:'Grammar'},
    {value: 'STREAMING', name:'Streaming'}
  ];
  selectedTool="Tool";
  
  constructor(private fb: FormBuilder, private headerService: HeaderService,private contactService: ContactsService) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email:['',Validators.required],
      organization: ['', Validators.required],
      description: ['', Validators.required],
      tool: ['', Validators.required],
    });
  }
  
  ngOnInit() {
    this.headerService.checkPage('contact');
  }
  
  get validate() {
    return this.contactForm.controls;
  }

  checkSubmit(form){
    if(form.status == "INVALID"){
      return true;
    } else {
      return false;
    }
  }

  checkSubmitBtn(form){
    if(form.status == "INVALID"){
      return 0.3;
    } else {
      return 1;
    }
  }
  
  onSubmit(form){
    this.submitted = true;
    console.log(form);

    if(this.emailReg.test(form.controls.email.value) && form.status == "VALID" || form.status == "PENDING"){
      this.sendForm = form.value;
      this.contactService.sendContactForm(this.sendForm).subscribe(
        data => {
          this.isSuccess = true;
          setTimeout(() => {
            this.isSuccess = false;
            window.location.reload();
          } , 5000);
          this.responseData = data
        },
        err => {
          this.error = true;
          console.log(err);
        }
        )
      } else {
        this.invalidForm = true;
        setTimeout(() => {
          this.invalidForm = false;
          this.submitted = false;
        } , 4000);
        
    }

   

    }
    
  }
  