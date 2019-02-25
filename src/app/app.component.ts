import { Component, ViewChild } from '@angular/core';
import { Platform, NavController, MenuController } from 'ionic-angular';
import * as firebase from 'firebase';

import { TabsPage } from "../pages/tabs/tabs";
import { SigninPage } from "../pages/signin/signin";
import { SignupPage } from "../pages/signup/signup";
import { AuthService } from '../services/auth';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  signinPage = SigninPage;
  signupPage = SignupPage;
  isAuthenticated =false;
  @ViewChild('nav') nav: NavController;

  constructor(platform: Platform,
    public menuCtrl: MenuController,
    private authService: AuthService) {
      firebase.initializeApp({
        apiKey: "AIzaSyDNYGud_mZAg_cQy1AZMweqIenZqCNMmFQ",
        authDomain: "ionic3-recipebook-cb49a.firebaseapp.com"
      });
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          this.isAuthenticated =true;
          this.rootPage = TabsPage;
        } else {
          this.isAuthenticated =false;
          this.rootPage = SigninPage;
        }
      });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.authService.logout();
    this.menuCtrl.close();
    this.nav.setRoot(SigninPage);
  }
}
