import { Injectable } from '@angular/core';
import * as algoliasearch from 'algoliasearch'; 
import * as algoliasearchHelper from 'algoliasearch-helper'; 

@Injectable({
  providedIn: 'root'
})


export class RestaurantSearchService {
  applicationID : String; 
  apiKey : String; 
  restaurantsIndex : String; 
  client: any; 
  helper: any; 

  constructor() {
    this.applicationID = "MZSHSRDY8C"; 
    this.apiKey = "7aff1b4d5d46a5b6f3e11bf0474d4ede"; 
    this.restaurantsIndex = "restaurants2"; 
    console.log("Restaurant search service initialized ..."); 
   }

   getHelper() {
    var client = algoliasearch(this.applicationID,this.apiKey);
    var helper = algoliasearchHelper(client, this.restaurantsIndex,{
      facets: ['info.food_type']
    });
    return helper; 
}
}
