import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { merge, Observable } from 'rxjs';
import { Country } from './models/country.model';
import { CountrySummary } from './models/countrySummary.model';
import { Day } from './models/day.model';
import { Global } from './models/global.model';
import { AngularFirestore } from '@angular/fire/firestore';
import firebase  from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth'; 
import { User } from './models/user.model';
import { Router } from '@angular/router';
import { News } from './models/news.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  apiUrl = 'https://api.covid19api.com/summary';
  countriesUrl='https://api.covid19api.com/countries';
  dayOneUrl = 'https://api.covid19api.com/dayone/country/';

  private countrySummary: CountrySummary;
  private user: User;

  constructor( private _http: HttpClient, private firestore: AngularFirestore,private afAuth: AngularFireAuth, private router: Router) {
   }

  async signInWithGoogle(){
    this.router.navigate(["signin"]);
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credentials.user.uid,
      email: credentials.user.email,
      displayName: credentials.user.displayName
    };
    console.log(credentials);
    
    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    this.router.navigate([""]);
  }
  private updateUserData(){
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
    },{merge: true});

  }

  getUser(){
    this.user= JSON.parse(localStorage.getItem("user"));
    return this.user;
  }

  userSignedIn(): boolean{
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  signOut(){
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user=null;
    this.router.navigate(["signin"]);
  }

  getGlobal(){
    return this._http.get<Global>(this.apiUrl);
  }


  getGlobalBySevenDays(){
    let today = new Date().toISOString().slice(0, 10);
    let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);;
    today = String(today) + 'T00:00:00Z';
    sevenDaysAgo = String(sevenDaysAgo) + 'T00:00:00Z';
    var url = 'https://api.covid19api.com/world';
    let params = new HttpParams().append('from', sevenDaysAgo).set('requestCert', 'false');
    params = params.append('to', today);
    return this._http.get<any[]>(url, {params: params});
  }

  getGlobalFrom13April(){
    let today = new Date().toISOString().slice(0, 10);
    today = String(today) + 'T00:00:00Z';
    let startDay = '2020-04-13T00:00:00Z';
    var url = 'https://api.covid19api.com/world';
    let params = new HttpParams().append('from', startDay);
    params = params.append('to', today);
    return this._http.get<any[]>(url, {params: params});
  }

  getSummaryByCountry(){
    return this._http.get<CountrySummary[]>(this.apiUrl);
  }

  getCountries(){
    return this._http.get<Country[]>(this.countriesUrl);
  }

  getCountryStats(slug: String){
    return this._http.get<Day[]>(this.dayOneUrl+slug);
  }

  updateCountrySummary(countrySummary: CountrySummary){    
    this.firestore.collection("countries").doc(countrySummary.Slug).collection('data').doc('countrySummary').set({
      Country: countrySummary.Country,
      Slug: countrySummary.Slug,
      NewConfirmed: countrySummary.NewConfirmed,
      TotalConfirmed: countrySummary.TotalConfirmed,
      NewDeaths: countrySummary.NewDeaths,
      TotalDeaths: countrySummary.TotalDeaths,
      NewRecovered: countrySummary.NewRecovered,
      TotalRecovered: countrySummary.TotalRecovered,
      Date: countrySummary.Date
    }, {merge: true});
  }

  getCountrySummary(slug: string){
    return this.firestore.collection("countries").doc(slug).collection('data').doc('countrySummary').valueChanges();
  }

  /* -------- To get the statistics to the 7 days, we will need data of 8 days ( then we do substraction ) ----------*/
  getAllByCountryBy8Days( slug: string){
    let today = new Date().toISOString().slice(0, 10);
    let eightDaysAgo = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);;
    today = String(today) + 'T00:00:00Z';
    eightDaysAgo = String(eightDaysAgo) + 'T00:00:00Z';
    var url = 'https://api.covid19api.com/total/country/'+slug;   
    let params = new HttpParams().append('from', eightDaysAgo);
    params = params.append('to', today);    
    return this._http.get<any[]>(url, {params: params});
  }

  getCountryFrom13April(slug: string){
    let today = new Date().toISOString().slice(0, 10);
    today = String(today) + 'T00:00:00Z';
    let startDay = '2020-04-13T00:00:00Z';
    var url = 'https://api.covid19api.com/total/country/'+slug;
    let params = new HttpParams().append('from', startDay);
    params = params.append('to', today);
    return this._http.get<any[]>(url, {params: params});
  }


  
  updateCountryBy7Days(slug:string,newDeaths: number[],newRecovered: number[], newCases: number[]){
    this.firestore.collection("countries").doc(slug).collection('data').doc('countryBy7Days').set({
      newDeaths: newDeaths,
      newRecovered: newRecovered,
      newCases: newCases,
      Date: new Date().toISOString().slice(0,10)
    }, {merge: true});
  }

  getCountryBy7Days(slug: string){
    return this.firestore.collection("countries").doc(slug).collection('data').doc('countryBy7Days').valueChanges();
  }


  getNews(slug:string){
    return this.firestore.collection("news").doc(slug).valueChanges();
  }

  //Get eligible users who can add news
  getEligibleUsers(){
    return this.firestore.collection("eligibleUsers").doc('data').valueChanges();
  }

  addNews(news:News){
    let data1;
    //Get old news, push the new one to the List
    this.getNews(news.Country).subscribe(data=>{
      data1 = data;
     
    });

    // After 1 sec, the data from above is ready 
    setTimeout( () => { 

      if(data1 == null ){
        console.log("VIDE");
        
         this.firestore.collection("news").doc(news.Country).set({
           user: [news.User],
           date: [news.Date],
           description: [news.Description],
           country: news.Country
         }, {merge: true});
       }else{
         let user = data1['user'];
         user.push(news.User);
         let date = data1['date'];
         date.push(news.Date);
         let description = data1['description'];
         description.push(news.Description);
         this.firestore.collection("news").doc(news.Country).set({
           user: user,
           date: date,
           description: description,
           country: news.Country
         }, {merge: true});
       }
    }, 1000 );
    
  }
}
