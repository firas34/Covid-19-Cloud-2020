import { User } from './../models/user.model';
import { Component, OnInit } from '@angular/core';
import { CovidService } from '../covid.service';
import { News } from '../models/news.model';

@Component({
  selector: 'app-add-news',
  templateUrl: './add-news.component.html',
  styleUrls: ['./add-news.component.css']
})
export class AddNewsComponent implements OnInit {

  country: string; // Slug
  day = new Date().toISOString().slice(0, 10);
  countries:string[]=[]; // List of all slugs
  newsModel: News= new News(this.covidService.getUser(),this.day,"","worldwide");
  alert: boolean;
  constructor( private covidService: CovidService) { }

  ngOnInit(): void {
    console.log(this.countries);
    
    this.alert=false;
    this.covidService.getCountries().subscribe(data=>{
      this.countries.push("worldwide");
      for(let country of data){
        this.countries.push(country.Slug);
      }    
    });
  }

  submit(){
    this.covidService.addNews(this.newsModel)
    this.alert=true;
    console.log(this.newsModel);
  }

}
