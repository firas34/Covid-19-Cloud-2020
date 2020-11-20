import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from './models/country.model';
import { Day } from './models/day.model';
import { Global } from './models/global.model';

@Injectable({
  providedIn: 'root'
})
export class CovidService {
  apiUrl = 'https://api.covid19api.com/summary';
  countriesUrl='https://api.covid19api.com/countries';
  dayOneUrl = 'https://api.covid19api.com/dayone/country/';


  constructor( private _http: HttpClient) { }

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

  getCountries(){
    return this._http.get<Country[]>(this.countriesUrl);
  }

  getCountryStats(slug: String){
    return this._http.get<Day[]>(this.dayOneUrl+slug);
  }


}
