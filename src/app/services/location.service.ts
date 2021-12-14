import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  


  constructor() {

  }

  async getPosition(){
    return Geolocation.getCurrentPosition();
  }
  


}
