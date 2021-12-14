import { Component } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { UtilitiesService } from '../services/utilities.service';
import { LocationService } from '../services/location.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  image:any;
  user:any;
  latitud:any;
  longitud:any;
  constructor(private authS:AuthService,
    public lstorage:LocalStorageService,
    private router:Router,
    private utils:UtilitiesService,
    private geolocation:LocationService) {
      this.user = authS.loadSession();
    }
    
    public async logout(){
      await this.authS.logout();
      this.router.navigate(['']);
    }
  
    public async takePhoto(){
      let options:ImageOptions={
         resultType:CameraResultType.Uri,
         allowEditing:false,
         quality:90,
         source:CameraSource.Camera
      }
      let result:Photo = await Camera.getPhoto(options);
      this.image=result.webPath;
    }

    public async getLocation() {
      
     this.latitud = (await this.geolocation.getPosition()).coords.latitude.toString();
     this.longitud = (await this.geolocation.getPosition()).coords.longitude.toString();
  
  }

  public async vibrate(){
    this.utils.vibrate();
  }

  
}
