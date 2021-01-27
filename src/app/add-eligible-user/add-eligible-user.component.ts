import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { Password } from '../models/password.model';
import { User } from '../models/user.model';


@Component({
  selector: 'app-add-eligible-user',
  templateUrl: './add-eligible-user.component.html',
  styleUrls: ['./add-eligible-user.component.css']
})
export class AddEligibleUserComponent implements OnInit {

  success: boolean;
  fail: boolean;
  passModel: Password= new Password("");
  user: User;


  constructor(private covidService: CovidService) { }

  ngOnInit(): void {
    this.user = this.covidService.getUser();

  }
  

  submit(){
    if (this.passModel.Pass == "eurecom2021"){
      this.covidService.addEligibleUser(this.passModel, this.user["email"])
      this.success=true;
    }else{
      this.fail=true;
    }
    
  }

}
