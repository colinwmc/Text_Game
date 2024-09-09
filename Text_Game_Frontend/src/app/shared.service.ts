import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";
import { item } from './models';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private APIUrl = "https://localhost:7125/api";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application.json',
    }),
  };
  constructor(private http: HttpClient) { }

  public PC: any;
  public itemsForSale: item[] = [{
    itemID: 14,
    itemDescription: 'A proper, frost pint.',
    itemName: 'Pint of Beer',
    itemQuantity: 1,
    imageID: ''
  },
  {
    itemID: 15,
    itemDescription: 'Golden fried spuds.',
    itemName: 'Fried Potatoes',
    itemQuantity: 1,
    imageID: ''
  },
  {
    itemID: 16,
    itemDescription: 'Restores 5 HP.',
    itemName: 'Health Potion',
    itemQuantity: 1,
    imageID: ''
  }];
  public beer: item = {
    itemID: 14,
    itemDescription: 'A proper, frost pint.',
    itemName: 'Pint of Beer',
    itemQuantity: 1,
    imageID: ''
  };
  public potatoes: item = {
    itemID: 15,
    itemDescription: 'Golden fried spuds.',
    itemName: 'Fried Potatoes',
    itemQuantity: 1,
    imageID: ''
  };
  public healthPotion: item = {
    itemID: 16,
    itemDescription: 'Restores 5 HP.',
    itemName: 'Health Potion',
    itemQuantity: 1,
    imageID: ''
  };

  getPCList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/PC', this.httpOptions);
  }

  skillCheck(modifier:string, dc:number, special:string) {
    let diceRoll = new Audio();
    diceRoll.src = "../assets/Sound Effects/rpg-dice-rolling-95182.mp3";
    diceRoll.load();
    diceRoll.play();

    let roll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    if(special === 'advantage'){
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if(secondRoll > roll){
        roll = secondRoll;
      }
    } else if(special === 'disadvantage'){
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if(secondRoll < roll){
        roll = secondRoll;
      }
    }
    let modValue = Math.floor((this.PC[modifier]-10)/2);
    return roll+modValue >= dc;
   
  }

  buyItem(cost: number, itemID: number) {
    let gold = this.PC.items.find((item: { itemID: number; }) => item.itemID === 13);
    if (gold.itemQuantity >= cost) {
      let moneyClink = new Audio();
      moneyClink.src = "../assets/Sound Effects/coins-falling-013-36967.mp3";
      moneyClink.load();
      moneyClink.play();
      gold.itemQuantity = gold.itemQuantity - cost;
      if (this.PC.items.find((item: { itemID: number; }) => item.itemID === itemID)) {
        this.PC.items.find((item: { itemID: number; }) => item.itemID === itemID).itemQuantity++;
      } else {
        this.PC.items.push(this.itemsForSale.find((itemForSale) => itemForSale.itemID === itemID))
      }
      return true;
    } else {
      return false;
    }
  }
}
