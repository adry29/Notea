import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonInfiniteScroll, LoadingController, ToastController, ModalController, IonRouterOutlet} from '@ionic/angular';
import { Nota } from '../model/Nota';
import { NotaService } from '../services/nota.service';
import { EditPage } from '../pages/edit/edit.page';
import { UtilitiesService } from '../services/utilities.service';
import { TextToSpeech } from '@capacitor-community/text-to-speech';
import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild(IonInfiniteScroll) scroll:IonInfiniteScroll;

  public notas : Nota[] = [];
  public nota:Nota;
  public filtered:any;
  public loading:HTMLIonLoadingElement;


  constructor(private notaservice:NotaService, private loadingc:LoadingController,
    private utils:UtilitiesService, public alertController:AlertController,
    private router:Router, public modalc:ModalController,
    private routerOutlet:IonRouterOutlet) {}

    async ionViewDidEnter(){
      await this.cargaNotas();
    }

    async ngOnInit(){
      await SplashScreen.show({
        showDuration: 2000,
        autoHide: true
      });
    }



    public async cargaNotas(event?){
      if(this.scroll){
        this.scroll.disabled=false;
      }
      if(!event){
        await this.utils.presentLoading();
      }
      this.notas=[];
      try{
        this.notas=await this.notaservice.getNotesByPage('algo').toPromise();
      }catch(error){
        console.log(error);
        await this.utils.presentToast("Error al cargar las notas", "danger");
      }finally{
        if(event){
          event.target.complete();
        }else{
          await this.utils.loading.dismiss();
        }
      }
    }

    public async infiniteCarga($event){
      let newNotas=await this.notaservice.getNotesByPage().toPromise();
      if(newNotas.length<10){
        $event.target.disabled=true;
      }
      this.notas=this.notas.concat(newNotas);
      $event.target.complete();
    }

    //Borra nota pidiendo al ususario su confirmación
    public async borrarNota(nota:Nota){
      
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: '¿Estas seguro de que quieres eliminar?',
        buttons: [
          {
            text: 'CANCELAR',
            role:'cancel',
            cssClass:'secondary',
            
            handler: () => {
              
            }
          }, {
            text: 'ELIMINAR',
            handler: async () => {
              
  
              await this.utils.presentLoading();
              await this.notaservice.remove(nota.key);
              this.utils.vibrate();
              await this.utils.presentToast('Nota eliminada', 'success');
              
              
              let i = this.notas.indexOf(nota, 0);
              if (i > -1) {
                this.notas.splice(i, 1);
              }
              await this.utils.loading.dismiss();
  
            }
          }
        ]
      });
      alert.present();
      
    }

    /**
     * 
     * @param nota 
     * Abre un modal con el formulario para editar la nota seleccionada
     */
    async editarNota(nota:Nota){
      const modal = await this.modalc.create({
        component: EditPage,
        cssClass: 'my-custom-class',
        componentProps:{
          nota
        },
      });
      return await modal.present();
    }
  
    /**
     * 
     * @param ev event sobre nuestro searchbar
     * crea una nueva lista de notas donde solo incluye
     * aquellas cuyo título o descripcion contenga el valor de ev
     */
    async getItems(ev: any) {
      let notes: Nota[] = []
      const value: string = ev.detail.value;
      if (value.length > 1) {

      for (let note of this.notas) {
        if (note.title.includes(value)) {
          notes.push(note);
        }
      };
      this.notas = notes;
    } else if (value.length == 0) {
      await this.cargaNotas();

    }
      
    }


    /**
     * 
     * @param photo url en base64 de la foto de la nota
     * @returns un string que consiste en la imagen convertida de manera que podamos
     * visualizarla en ion-img
     */
    public showImage(photo:string): string{
      let converted_image:string= "data:image/jpeg;base64,"+photo;
      return converted_image;
    }

    public async read(nota:string){
    
      await TextToSpeech.speak({
        text: nota,
        lang: 'es-ES',
        rate: 1.0,
        
      });
    
  }

}
