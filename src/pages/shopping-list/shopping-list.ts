import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { shoppingListService } from '../../services/shopping-list';
import { Ingredient } from '../../models/ingredient';
import { PopoverController, LoadingController, AlertController } from 'ionic-angular';
import  {DatabaseOptionsPage} from '../database-options/database-options'
import { AuthService } from '../../services/auth';


@Component({
  selector: 'page-shopping-list',
  templateUrl: 'shopping-list.html',
})
export class ShoppingListPage {
  listItems: Ingredient[];
  constructor(private slService: shoppingListService,
              private popOverCtrl:PopoverController,
              private authService:AuthService,
              private loadingCtrl: LoadingController,
              private alertCtrl:AlertController){}
  ionViewWillEnter(){
    this.loadItems();
  }
  onAddItem(form: NgForm){
    this.slService.addItem(form.value.ingredientName,form.value.amount);
    form.reset();
    this.loadItems();
  }
  onCheckItem(index: number){
    this.slService.removeItem(index);
    this.loadItems();
  }

  onShowOptions(event: MouseEvent){
    const loading =this.loadingCtrl.create({
      content:'please wait...'
    });
    const popover =this.popOverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event });
    popover.onDidDismiss(
      data =>{
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) =>{
              this.slService.fetchList(token)
                .subscribe(
                  (list: Ingredient[])=>{
                    loading.dismiss();
                    if (list) {
                      this.listItems =list;
                    } else {
                      this.listItems =[];
                    }
                  },
                  error =>{
                    loading.dismiss();
                    this.handleError(error.message);
                  }
                );
            });
        } else if (data.action == 'store'){
          loading.present();
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) =>{
              this.slService.storeList(token)
                .subscribe(
                  ()=>loading.dismiss(),
                  error =>{
                    loading.dismiss();
                    this.handleError(error.message);
                  }
                );
            });
        }
      }
    );
  }
  private loadItems(){
    this.listItems =this.slService.getItems();
  }
  private handleError(errorMessage: string){
    const alert =this.alertCtrl.create({
      title:'An error occured!...',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
