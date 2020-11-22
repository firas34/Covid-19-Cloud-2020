import { CountrySummary } from './../models/countrySummary.model';
import { Country } from './../models/country.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../covid.service';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countrySlug: string;
  countrySummary: CountrySummary = new CountrySummary; // Everytime, we need to initialize VARIALBLE !
  countryData: CountrySummary= new CountrySummary;

  //Pie Chart
  PieChart=[];
  pieData=[];
  //Bar chart  
  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels=[];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData=[];
  constructor(private route: ActivatedRoute, private covidService: CovidService) { }

  findCountrySummary(slug: string, data: CountrySummary[]): CountrySummary{
    for (let i=0;i<data.length;++i) {
      if (data[i]['Slug'] == slug){
        return data[i];
      }
    }
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params=>{
      this.countrySlug = params.get('country');
    })     

    //Cases By Country
    var todayDate = new Date().toISOString().slice(0,10);
    this.covidService.getCountrySummary(this.countrySlug).subscribe((data:CountrySummary)=>{

      if (data != undefined && data['Date'].slice(0,10)==todayDate){
        console.log('RETREIVE FROM FIRESTORE');
          this.countrySummary = data;
          console.log(this.countrySummary);
          //Pie Chart
          this.pieData=[this.countrySummary.TotalDeaths, this.countrySummary.TotalRecovered, this.countrySummary.TotalConfirmed - this.countrySummary.TotalDeaths - this.countrySummary.TotalRecovered];
          this.PieChart.push(new Chart('pieChart', {
            type: 'pie',
            data:{
              labels:["Dead Cases","Recovered Cases", "Active Cases"],
              datasets:[{
                label: 'vote now',
                data: this.pieData,
                backgroundColor:[
                  'rgba(255, 158, 255,0.9)',
                  'rgba(158, 208, 255,0.9)',
                  'rgba(255, 239, 158,0.9)',
                ]
              }]
            },
            options:{
              title:{
                display: true
              }
            }
          }));
        
      }else{
        // Update Database from API
        console.log('RETRIEVE FROM API & UPDATE DATABASE');
        this.covidService.getSummaryByCountry().subscribe(data=>{ 
          this.countrySummary = this.findCountrySummary(this.countrySlug,data['Countries']);
          
          this.covidService.updateCountrySummary(this.countrySummary);    
         /*  //Pie Chart
          this.pieData=[this.countrySummary.TotalDeaths, this.countrySummary.TotalRecovered, this.countrySummary.TotalConfirmed - this.countrySummary.TotalDeaths - this.countrySummary.TotalRecovered];
          this.PieChart.push(new Chart('pieChart', {
            type: 'pie',
            data:{
              labels:["Dead Cases","Recovered Cases", "Active Cases"],
              datasets:[{
                label: 'vote now',
                data: this.pieData,
                backgroundColor:[
                  'rgba(255, 158, 255,0.9)',
                  'rgba(158, 208, 255,0.9)',
                  'rgba(255, 239, 158,0.9)',
                ]
              }]
            },
            options:{
              title:{
                display: true
              }
            }
          })) */
          
        });  
        
      }
      
    })
                
    
    

    
  }



}
