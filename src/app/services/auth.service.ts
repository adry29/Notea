import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;
  private isAndroid = false;

  constructor(private platform: Platform,
    private lstorage: LocalStorageService,
    public authfire: AngularFireAuth) {
    this.isAndroid = platform.is("android");
    //if (!this.isAndroid) {
      //GoogleAuth.init();
    //}
  }


  //Carga sesión si hay algún usuario guardado
  public async loadSession(){
    let user= await this.lstorage.getItem('user');
    if(user){
      user=JSON.parse(user);
      this.user=user;
    }
  }

  //inicia sesión mediante firebase
  loginFire(userdata: {email:any; password:any}):Promise<Boolean>{
    return new Promise(async (resolve, reject) => {
      this.authfire.signInWithEmailAndPassword(userdata.email, userdata.password)
        .then(async u => {
          if (u != null && u.user != null) {
            this.user = {
              displayName: u.user?.displayName,
              email: u.user?.email,
              photoURL: u.user?.photoURL,
              uid: u.user?.uid
            };
            await this.keepSession();
            resolve(true);
          } else {
            reject(false);
            this.user = null;
          }
        })
        .catch(
          error => {
            console.log(error);
          }
        );
    })
  }

  //registro mediante firebase
   userRegistration(value){
    return new Promise<any> ( (resolve, reject)=>{
      this.authfire.createUserWithEmailAndPassword(value.email,value.password).then(
        res => resolve(res),
        error => reject(error)
      )
    })
  }

  //inicia sesión mediante Google
  public async loginGoogle(){
    
    let user:User = await GoogleAuth.signIn();
    this.user=user;
    await this.keepSession();
  }

  //Cierra sesión y elimina el usuario de localstorage
  public async logout() {
    GoogleAuth.signOut();
    await this.lstorage.removeItem('user');
    this.user = null;
  }

  //Guarda el usuario para mantener la sesión abierta
  public async keepSession() {
    await this.lstorage.setItem('user', JSON.stringify(this.user));
  }

  public isLogged(): boolean {
    if (this.user) return true; else return false;
  }

  //Inicializa los servicios de googleAuth
  public gooogleAuthInitWeb() {
    GoogleAuth.init();
  }

}
