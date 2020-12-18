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

  constructor(public covidService: CovidService) { }

  ngOnInit(): void {

    this.userSignedIn = this.covidService.userSignedIn();
    this.user = this.covidService.getUser();
    
    
  }

}
