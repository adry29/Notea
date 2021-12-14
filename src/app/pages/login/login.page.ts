import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfoG:User;
  private userdata:any;
  public loginForm: FormGroup | any;
  
  constructor(private platform:Platform,
    private authS:AuthService,
    private router:Router,
    public fb:FormBuilder,
    private utils:UtilitiesService) {
      this.loginForm = this.fb.group({
        'email': ['', [Validators.required, Validators.email]],
        'password': ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  ngOnInit() {
    if(this.authS.isLogged()){
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  ionViewWillEnter(){
    if(this.authS.isLogged){
      this.router.navigate(['private/tabs/tab1']);
    }

   
  }

  onSubmit() {
    this.userdata = this.saveUserdata();
    this.authS.loginFire(this.userdata)
      .then(data => {
        if (data) {
          this.utils.presentToast("Sesión iniciada", "success");
          this.router.navigate(['private/tabs/tab1']);
        }
      })
      .catch(error => {
          console.log(error);
        }
      );
  }

  saveUserdata() {
    const saveUserdata = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    return saveUserdata;
  }
  


  public async signinGoogle() {
    try {
      await this.authS.loginGoogle();
      this.utils.presentToast("Sesión iniciada", "success");
      this.router.navigate(['private/tabs/tab1']);
    } catch (error) {
      console.log(error);
      this.utils.presentToast("No se pudo iniciar sesión", "error");
    }
  }

  public async signUp() {
    try {
      this.router.navigate(['signup']);
    } catch (err) {
      console.error(err);
    }
  }

}
