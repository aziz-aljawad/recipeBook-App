import { Ingredient } from "../models/ingredient";
import { Injectable } from "@angular/core";
import {   HttpClient } from '@angular/common/http';
import { AuthService } from "./auth";
import 'rxjs/Rx';
@Injectable()
export class shoppingListService {
    constructor(private httpclient: HttpClient,private authService:AuthService){}
    private ingredients: Ingredient[] =[];
    addItem(name: string,amount: string){
        this.ingredients.push(new Ingredient(name,amount));
        console.log(this.ingredients);
    }

    addItems(items: Ingredient[]){
        this.ingredients.push(...items);
    }

    getItems(){
        return this.ingredients.slice();
    }
    removeItem(index: number){
        this.ingredients.splice(index, 1);
    }
    storeList(token: string){
        const userId =this.authService.getActiveUser().uid;
        return this.httpclient
        .put('https://ionic3-recipebook-cb49a.firebaseio.com/ ' + userId + '/shopping-list.json?auth='
        +token,this.ingredients);
    }
    fetchList(token: string){
        const userId =this.authService.getActiveUser().uid;
        return this.httpclient.get('https://ionic3-recipebook-cb49a.firebaseio.com/ ' + userId + '/shopping-list.json?auth='
        +token)
        .do((ingredients: Ingredient[])=>{
          if (ingredients) {
              this.ingredients =ingredients
          } else {
              this.ingredients =[];
          }
        });
    }
}