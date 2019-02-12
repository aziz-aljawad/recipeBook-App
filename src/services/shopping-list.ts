import { Ingredient } from "../models/ingredient";

export class shoppingListService {
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

}