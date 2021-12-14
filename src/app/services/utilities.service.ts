import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Haptics } from '@capacitor/haptics';

@Injectable({
  providedIn: 'root'
})
export class UtilitiesService {

  constructor(public loading: LoadingController,
    public toast: ToastController,
    public modal:ModalController) { }

    async presentLoading() {
      const loading = await this.loading.create({
        cssClass: 'my-custom-class',
        message: '',
        spinner: "crescent"
      });
      await loading.present();
    }
    async presentToast(msg:string,clr:string) {
      const toast = await this.toast.create({
        message: msg,
        color: clr,
        duration: 2000,
        position:"top"
      });
      toast.present();
    }

    async vibrate(){
      await Haptics.vibrate({
        duration:600
      });
    }
}
