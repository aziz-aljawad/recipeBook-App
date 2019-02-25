import { Component } from '@angular/core';
import { NavController, PopoverController, LoadingController, AlertController } from 'ionic-angular';
import { EditRecipePage } from '../edit-recipe/edit-recipe';
import { Recipe } from '../../models/recipe';
import { RecipesService } from '../../services/recipes';
import { RecipePage } from '../recipe/recipe';
import { DatabaseOptionsPage } from '../database-options/database-options';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',
})
export class RecipesPage {
  recipes: Recipe[];

  constructor(private navCtrl:NavController,
              private recipeService:RecipesService,
              private popoverCtrl:PopoverController,
              private loadingCtrl: LoadingController,
              private alertCtrl:AlertController,
              private authService:AuthService){}
  ionViewWillEnter(){
    this.recipes =this.recipeService.getRecipes();
  }
  onNewRecipe(){
    this.navCtrl.push(EditRecipePage, {mode:'New'});
  }
  onLoadRecipe(recipe:Recipe, index:number){
    this.navCtrl.push(RecipePage, {recipe:recipe, index: index});
  }
  onShowOptions(event: MouseEvent){
    const loading =this.loadingCtrl.create({
      content:'please wait...'
    });
    const popover =this.popoverCtrl.create(DatabaseOptionsPage);
    popover.present({ev: event });
    popover.onDidDismiss(
      data =>{
        if (data.action == 'load') {
          loading.present();
          this.authService.getActiveUser().getIdToken()
          .then(
            (token: string) =>{
              this.recipeService.fetchList(token)
                .subscribe(
                  (list: Recipe[])=>{
                    loading.dismiss();
                    if (list) {
                      this.recipes =list;
                    } else {
                      this.recipes =[];
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
              this.recipeService.storeList(token)
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

  private handleError(errorMessage: string){
    const alert =this.alertCtrl.create({
      title:'An error occured!...',
      message: errorMessage,
      buttons: ['Ok']
    });
    alert.present();
  }
}
