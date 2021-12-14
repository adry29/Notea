import { Component, OnInit } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private isAndroid=false;
  constructor(
    private storage:LocalStorageService,
    private authS:AuthService,private platform:Platform) {
    
  }
  async ngOnInit() {
    await this.authS.loadSession();
    this.platform.ready().then(async ()=>{
      this.isAndroid=this.platform.is("android");
      if(!this.isAndroid)
        await GoogleAuth.init();
      await this.authS.loadSession();
    })
  }
}
