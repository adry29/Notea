import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public userdata: any;
  public signform: FormGroup | any;

  constructor(
    private authS: AuthService,
    private fb: FormBuilder,
    private router: Router) {
      this.signform = this.fb.group({
        'email': ['', [Validators.required, Validators.email]],
        'password': ['', [Validators.required, Validators.minLength(6)]]
      });
  }

  ngOnInit() {
  }

  cancel(){
    this.router.navigate(['']);
  }


  onSubmit() {
    this.userdata = this.saveUserdata();
    this.authS.userRegistration(this.userdata)
      .then(data => {
        if (data) {
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
      email: this.signform.get('email').value,
      password: this.signform.get('password').value,
    };
    return saveUserdata;
  }


}