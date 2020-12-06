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

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  apiUrl = 'https://api.covid19api.com/summary';
  countriesUrl='https://api.covid19api.com/countries';
  dayOneUrl = 'https://api.covid19api.com/dayone/country/';

  private countrySummary: CountrySummary;
  private user: User;
  // To check if the user is logged in 
  userCheck: Observable<firebase.User>;

  constructor( private _http: HttpClient, private firestore: AngularFirestore,private afAuth: AngularFireAuth, private router: Router) {
    this.userCheck = afAuth.user;
   }

  async signInWithGoogle(){
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.user = {
      uid: credentials.user.uid,
      email: credentials.user.email,
      displayName: credentials.user.displayName
    };
    console.log(credentials);
    
    //localStorage.setItem("user", JSON.stringify(this.user));
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

  getGlobal(){
    return this._http.get<Global>(this.apiUrl);
  }


  getGlobalBySevenDays(){
    let today = new Date().toISOString().slice(0, 10);
    let sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);;
    today = String(today) + 'T00:00:00Z';
    sevenDaysAgo = String(sevenDaysAgo) + 'T00:00:00Z';
    var url = 'https://api.covid19api.com/world';
    let params = new HttpParams().append('from', sevenDaysAgo);
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

  /* -------- To get the statistics to the 7 days, we will need data of 8 days ( we are doing substraction ) ----------*/
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


}
