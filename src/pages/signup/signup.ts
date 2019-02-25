import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { LoadingController, AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  constructor(private authService: AuthService,
    private loadingCtrl:LoadingController,private alertCtrl:AlertController){}
 onSignup(form: NgForm){
   let loading =this.loadingCtrl.create({
     content:"signing you up..."
   });
   loading.present();
   this.authService.signup(form.value.email, form.value.password)
   .then(data => {
     loading.dismiss();
   })
   .catch(err => {
    loading.dismiss();
    let alert = this.alertCtrl.create({
      title:'Signup failed!',
      message: err.message,
      buttons: ['Ok']
    });
    alert.present();
  });
 }
}
