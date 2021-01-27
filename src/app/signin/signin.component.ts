import { User } from './../models/user.model';
import { CovidService } from './../covid.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  userSignedIn: boolean;
  user: User;
  isEligibleUser: boolean=false;


  constructor(public covidService: CovidService) { }

  ngOnInit(): void {

    this.userSignedIn = this.covidService.userSignedIn();
    this.user = this.covidService.getUser();
    
    
    // User eligibility
    this.covidService.getEligibleUsers().subscribe(data=>{
    for (let i=0;i<data['email'].length;i++){
      if (this.user.email == data['email'][i]){
        this.isEligibleUser = true;
        break;          
      }
      
    }
    
  })
    
  }

}
