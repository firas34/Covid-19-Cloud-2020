import { CountrySummary } from './../models/countrySummary.model';
import { Country } from './../models/country.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CovidService } from '../covid.service';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js' ;
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countrySlug: string;
  countrySummary: CountrySummary = new CountrySummary; // Everytime, we need to initialize VARIALBLE !
  countryData: CountrySummary= new CountrySummary;

  //will be used for 7 days bar chart
  newDeaths: number[]=[];
  newRecovered: number[]=[];
  newCases: number[]=[];

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

  //Line chart 
  newDeathsLine: number[]=[];
  newRecoveredLine: number[]=[];
  newCasesLine: number[]=[];
  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };

  public lineChartColors: Color[] = [
    { // Deaths
      backgroundColor: 'rgba(232, 37, 147, 0.34)',
      borderColor: 'rgba(0,0,0,1)',
      pointBackgroundColor: 'rgba(0,0,0,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // Recovered
      backgroundColor: 'rgba(27, 141, 229, 0.41)',
      borderColor: 'rgba(30, 137, 232, 0.41)',
      pointBackgroundColor: 'rgba(30, 137, 232,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // Cases
      backgroundColor: 'rgba(232, 181, 30, 0.34)',
      borderColor: 'rgba(221, 182, 24, 1)',
      pointBackgroundColor: 'rgba(221, 182, 24, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private route: ActivatedRoute, private covidService: CovidService) { }

  findCountrySummary(slug: string, data: CountrySummary[]): CountrySummary{
    for (let i=0;i<data.length;++i) {
      if (data[i]['Slug'] == slug){
        return data[i];
      }
    }
  }
  ngOnInit(): void {
    //force the page to be displayed from the TOP
    window.scrollTo(0, 0);
    this.route.paramMap.subscribe(params=>{
      this.countrySlug = params.get('country');
    })     

    //Cases By Country
    var todayDate = new Date().toISOString().slice(0,10);
    this.covidService.getCountrySummary(this.countrySlug).subscribe((data:CountrySummary)=>{

      if (data != undefined && data['Date'].slice(0,10)==todayDate){
        console.log('RETREIVE FROM FIRESTORE');
          this.countrySummary = data; 
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
        });  
        
      }
      
    })


    /* this.covidService.getAllByCountryBy8Days(this.countrySlug).subscribe(data=>{
      for (var i=1;i < data.length;++i){
        this.newDeaths.push(data[i]["Deaths"]-data[i-1]["Deaths"]);
        this.newCases.push(data[i]["Confirmed"]-data[i-1]["Confirmed"]);
        this.newRecovered.push(data[i]["Recovered"]-data[i-1]["Recovered"]);
      }
      this.barChartData = [
        {data: this.newDeaths, label: 'Daily Deaths'},
        {data: this.newRecovered, label: 'Daily Recovered'},
        {data: this.newCases, label: 'Daily New Cases'},
      ]
      // Preparing the Bar Chart Label
      for (let i=0;i<=7;++i){
        let day = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toString().split(' ').splice(1,2).reverse().join(' ');
        this.barChartLabels.push(day);
      }
      //Final step to get the right labels list
      this.barChartLabels.reverse();
    }); */

    var todayDate = new Date().toISOString().slice(0,10);
    this.covidService.getCountryBy7Days(this.countrySlug,).subscribe(data=>{
        if (data != undefined && data['Date']==todayDate){
            console.log('RETREIVE FROM FIRESTORE  (7days) ');
            this.newDeaths = data["newDeaths"];
            this.newCases = data["newCases"];
            this.newRecovered = data["newRecovered"];
            this.barChartData = [
            {data: this.newDeaths, label: 'Daily Deaths'},
            {data: this.newRecovered, label: 'Daily Recovered'},
            {data: this.newCases, label: 'Daily New Cases'},
            ]
            // Preparing the Bar Chart Label
            for (let i=0;i<=7;++i){
            let day = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toString().split(' ').splice(1,2).reverse().join(' ');
            this.barChartLabels.push(day);
            }
            //Final step to get the right labels list
            this.barChartLabels.reverse();
        }else{
            // Update Database from API
            console.log('RETRIEVE FROM API & UPDATE DATABASE  (7days)');
            this.covidService.getAllByCountryBy8Days(this.countrySlug).subscribe(data=>{ 
                for (var i=1;i < data.length;++i){
                    this.newDeaths.push(data[i]["Deaths"]-data[i-1]["Deaths"]);
                    this.newCases.push(data[i]["Confirmed"]-data[i-1]["Confirmed"]);
                    this.newRecovered.push(data[i]["Recovered"]-data[i-1]["Recovered"]);
                    }
              
                this.covidService.updateCountryBy7Days(this.countrySlug,this.newDeaths,this.newRecovered,this.newCases );              
            });  
        }
        
      });

    

    // Line Chart: --------------------------------------------//
    this.covidService.getCountryFrom13April(this.countrySlug).subscribe(data=>{

      // ------------------------------------------------ //
      for (var j of data){
        this.newDeathsLine.push(j["Deaths"]);
        this.newCasesLine.push(j["Confirmed"]);
        this.newRecoveredLine.push(j["Recovered"]);
      }

      this.lineChartData = [
        {data: this.newDeathsLine, label: 'Total Deaths'},
        {data: this.newRecoveredLine, label: 'Total Recovered'},
        {data: this.newCasesLine, label: 'Total Cases'},
      ]
      //Line Label Array
      let i = 0;
      let day = new String;
      var dayTest = new String();
      while (dayTest.toString() != '4/13/2020'){
        let day = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toString().split(' ').splice(1,2).reverse().join(' ');
        this.lineChartLabels.push(day);
        dayTest = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleString().split(',')[0];
        ++i;
      }
      this.lineChartLabels.reverse();
      
    });
                
    
    

    
  }



}
