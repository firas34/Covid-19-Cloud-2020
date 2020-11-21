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
    

    this.covidService.getSummaryByCountry().subscribe(data=>{ 
      
      this.countryData = this.findCountrySummary(this.countrySlug,data['Countries']);
      this.countrySummary.Country =  this.countryData['Country'];
      this.countrySummary.Slug =  this.countryData['Slug'];
      this.countrySummary.NewConfirmed =  this.countryData['NewConfirmed'];
      this.countrySummary.TotalConfirmed =  this.countryData['TotalConfirmed'];
      this.countrySummary.NewDeaths =  this.countryData['NewDeaths'];
      this.countrySummary.TotalDeaths =  this.countryData['TotalDeaths'];
      this.countrySummary.NewRecovered =  this.countryData['NewRecovered'];
      this.countrySummary.TotalRecovered =  this.countryData['TotalRecovered'];
      this.covidService.updateCountrySummary(this.countrySummary);    
      //console.log(this.findCountrySummary('france', data['Countries']));

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
    }))
      
    });              
    
    

    
  }



}
