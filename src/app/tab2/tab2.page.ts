import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nota } from '../model/Nota';
import { NotaService } from '../services/nota.service';
import { Camera, CameraDirection, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { UtilitiesService } from '../services/utilities.service';
import { LocationService } from '../services/location.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public image:any;
  public formNota:FormGroup;
  public loading:HTMLIonLoadingElement;
  private toast:HTMLIonToastElement;
  private isAndroid:boolean;

  constructor(private fb:FormBuilder,
              private noteS:NotaService,
              private utils:UtilitiesService,
              private platform:Platform) {
    this.formNota=this.fb.group({
      title:["", Validators.required],
      description:[""]
    });
    this.isAndroid=platform.is("android");

}

async ngOnInit(){
  if(this.isAndroid){
    let hasPersmission = Camera.checkPermissions();
    if(!Camera.checkPermissions()){
      Camera.requestPermissions();
    }
  }
}


ionViewDidEnter(){}

//Añade una nota con los valores del formulario
//Solo asigna a photo un valor si el usuario ha seleccionado una imagen
public async addNota(){

  //Creamos nueva nota con el key de la nota a editar
  //Los valores de nuevaNota sobrescribirán los de la nota anterior

  let nuevaNota:Nota;
  if(this.image!=null)
  {
    nuevaNota={
    title:this.formNota.get("title").value,
    description:this.formNota.get("description").value,
    photo:this.image,
    }
    await this.utils.presentLoading();
  try{
    let id=await this.noteS.addNota(nuevaNota);
    this.loading && this.loading.dismiss();
    await this.utils.presentToast("Nota añadida", "success");
    this.formNota.reset;
  }catch(error){
    console.log(error);
    this.loading && this.loading.dismiss;
    await this.utils.presentToast("Error agregando nota", "danger");
    
  }finally{
    this.utils.loading.dismiss();
  }



  }else{
  nuevaNota={
    title:this.formNota.get("title").value,
    description:this.formNota.get("description").value,
  }
  await this.utils.presentLoading();
  try{
    let id=await this.noteS.addNotaNoPhoto(nuevaNota);
    this.loading && this.loading.dismiss();
    await this.utils.presentToast("Nota añadida", "success");
    this.formNota.reset;
  }catch(error){
    console.log(error);
    this.loading && this.loading.dismiss;
    await this.utils.presentToast("Error agregando nota", "danger");
    
  }finally{
    this.utils.loading.dismiss();
  }
}
  
}

//Seleccionamos una imagen y la guardamos en base64 como photo de la nota
public async takePhoto(){
  let toSave:ImageOptions={
     resultType:CameraResultType.Base64,
     allowEditing:false,
     quality:30,
     source:CameraSource.Camera
  }
  let result:Photo = await Camera.getPhoto(toSave);
  this.image=result.base64String;
}

public showImage(photo:string): string{
  let converted_image:string= "data:image/jpeg;base64,"+photo;
  return converted_image;
}
   
   
   
}
