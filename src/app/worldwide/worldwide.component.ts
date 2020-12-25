import { CountrySummary } from './../models/countrySummary.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CovidService } from '../covid.service';
import { Global } from '../models/global.model';
import { Chart, ChartDataSets, ChartOptions, ChartType } from 'chart.js' ;
import { Country } from '../models/country.model';
import { BaseChartDirective, Color, Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { User } from '../models/user.model';
import { News } from '../models/news.model';




@Component({
  selector: 'app-worldwide',
  templateUrl: './worldwide.component.html',
  styleUrls: ['./worldwide.component.css']
})
export class WorldwideComponent implements OnInit {

  //For Challenge2: News
  newsDescriptions:string[];
  newsDates:string[];
  newsUsers:User[];
  newsLength:number=0;

  user:User;
  // if user is signed in:
  isUser: boolean = false;
  day = new Date(Date.now()).toString().split(' ').splice(1,4).reverse().join(' ');
  news:News[]; //[new News(this.covidService.getUser(),this.day,"News","worldwide")]
  predicateBy(prop){
    return function(a,b){
       if (a[prop] > b[prop]){
           return 1;
       } else if(a[prop] < b[prop]){
           return -1;
       }
       return 0;
    }
 }  
  global: Global=new Global;
  countries: Country[];
  slugs: string[] =  [];
  s: string[]=[];
  //will be used for 7 days bar chart
  newDeaths: number[]=[];
  newRecovered: number[]=[];
  newCases: number[]=[];
  // Pie Chart
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
  
  countriesSummary: CountrySummary[] = [];
  constructor(private covidService: CovidService) { }

  //Used in the loop to display News
  arrayOne(n: number): any[] {
    return Array(n);
  }

  ngOnInit(): void {

    //For challenge2: News
    this.covidService.getNews("worldwide").subscribe(data=>{
      console.log(data);
      this.newsDescriptions=data['description'];
      this.newsDates=data['date'];
      this.newsUsers=data['user'];
      this.newsLength=this.newsDescriptions.length;
    });

    this.user = this.covidService.getUser();
    if(this.covidService.userSignedIn()){
      this.isUser = true;
    }else{
      this.isUser=false;
    }
    this.covidService.getGlobal().subscribe(data => {
      this.global = data["Global"];
      this.pieData=[this.global.TotalDeaths, this.global.TotalRecovered, this.global.TotalConfirmed - this.global.TotalDeaths - this.global.TotalRecovered];
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
    
    // Bar Chart: 
    this.covidService.getGlobalBySevenDays().subscribe(data=>{
      // Before Starting, we need to sort the data (TotalConfirmed)
      data.sort(this.predicateBy("TotalConfirmed"));
      // ------------------------------------------------ //
      for (var i of data){
        this.newDeaths.push(i["NewDeaths"]);
        this.newCases.push(i["NewConfirmed"]);
        this.newRecovered.push(i["NewRecovered"]);
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
      /* let day = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toString().split(' ').splice(1,2).reverse().join(' ');
      this.barChartLabels.push(day); */
    })


    // Line Chart: --------------------------------------------//
    this.covidService.getGlobalFrom13April().subscribe(data=>{
      // Before Starting, we need to sort the data (TotalConfirmed)
      data.sort(this.predicateBy("TotalConfirmed"));
      // ------------------------------------------------ //
      for (var j of data){
        this.newDeathsLine.push(j["TotalDeaths"]);
        this.newCasesLine.push(j["TotalConfirmed"]);
        this.newRecoveredLine.push(j["TotalRecovered"]);
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
      
    })
    //------------------------------------------------------ // 
    //Cases By Country

    this.covidService.getSummaryByCountry().subscribe(data=>{
      this.countriesSummary = data["Countries"];          
    });
    //------------------------------------------------------ // 

    


  
    


  }

  key: string = 'Country';
  reverse: boolean = false;
  sort(key){
    this.key=key;
    this.reverse = !this.reverse;
  }
  
}

