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
  public encounters: string[] = [];
  public hurting = false;
  public itemsForSale: item[] = [{
    itemID: 14,
    itemDescription: 'A proper, frosty pint.',
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

  public successfullyCharmed = false;
  public failedToCharm = false;
  public smiledDisarmingly = false;
  public wasConfrontatitional = false;
  public identifiedEmblem = false;
  public hasKilledFae = false;

  public ending = 0;

  getPCList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/PC', this.httpOptions);
  }

  skillCheck(modifier: string, dc: number, special: string) {
    let diceRoll = new Audio();
    diceRoll.src = "../assets/Sound Effects/rpg-dice-rolling-95182.mp3";
    diceRoll.load();
    diceRoll.play();

    let roll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    if (special === 'advantage') {
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if (secondRoll > roll) {
        roll = secondRoll;
      }
    } else if (special === 'disadvantage') {
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if (secondRoll < roll) {
        roll = secondRoll;
      }
    }
    let modValue = Math.floor((this.PC[modifier] - 10) / 2);
    console.log('Roll(' + roll + ') + Modifier(' + modValue + ') = ' + (roll + modValue) + (roll + modValue >= dc ? ' > ' : ' < ') + dc);
    return roll + modValue >= dc;

  }

  buyItem(cost: number, itemID: number) {
    let gold = this.PC.items.find((item: { itemID: number; }) => item.itemID === 13);
    if (gold.itemQuantity >= cost) {
      if (cost !== 0) {
        let moneyClink = new Audio();
        moneyClink.src = "../assets/Sound Effects/coins-falling-013-36967.mp3";
        moneyClink.load();
        moneyClink.play();
      }
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

  useItem(itemID: number) {
    if (this.PC.currentHealth > 0) {
      switch (itemID) {
        case 1:
        case 4:
          let raccon = new Audio();
          raccon.src = "../assets/Sound Effects/raccoon.mp4";
          raccon.load();
          raccon.play();
          if (itemID === 4) {
            let eat = new Audio();
            eat.src = "../assets/Sound Effects/eating.mp3";
            eat.load();
            eat.play();
            this.removeItem(itemID);
          }
          break;
        case 7:
        case 14:
        case 16:
          let drink = new Audio();
          drink.src = "../assets/Sound Effects/glug-glug-glug-39140.mp3";
          drink.load();
          drink.play();
          this.removeItem(itemID);
          if (itemID === 7) {
            this.PC.enhancedStink = true;
          }
          if (itemID === 14) {
            this.PC.charisma++;
            if (this.PC.charismaBoosted) {
              this.PC.charismaBoosted++;
            } else {
              this.PC.charismaBoosted = 1;
            }
          }
          if (itemID === 16) {
            if ((this.PC.currentHealth + 5) < this.PC.hp) {
              this.PC.currentHealth = this.PC.currentHealth + 5;
            } else {
              this.PC.currentHealth = this.PC.hp;
            }
          }
          break;
        case 15:
        case 17:
          let eat = new Audio();
          eat.src = "../assets/Sound Effects/eating.mp3";
          eat.load();
          eat.play();
          if (itemID === 15) {
            this.PC.constitution++;
            if (this.PC.constitutionBoosted) {
              this.PC.constitutionBoosted++;
            } else {
              this.PC.constitutionBoosted = 1;
            }
          }
          else if (itemID === 17) {
            this.takeDamage(10);
          }
          this.removeItem(itemID);
          break;
      }
    }
  }

  removeItem(itemID: any) {
    let item = this.PC.items.find((i: { itemID: any; }) => i.itemID === itemID);
    if (item.itemQuantity > 1) {
      item.itemQuantity--;
    } else {
      let index = this.PC.items.findIndex((i: { itemID: any; }) => i.itemID === itemID);
      this.PC.items.splice(index, 1);
    }
  }

  takeDamage(amount: number) {
    let damage = new Audio();
    damage.src = "../assets/Sound Effects/retro-hurt-2-236675.mp3";
    damage.load();
    damage.play();
    this.PC.currentHealth = this.PC.currentHealth - amount;
    this.hurting = true;
    setTimeout(() => {
      this.hurting = false;
    }, 250);
    setTimeout(() => {
      this.hurting = true;
    }, 500);
    setTimeout(() => {
      this.hurting = false;
    }, 750);
  }

  deboostStats() {
    if (this.PC.charismaBoosted) {
      this.PC.charisma = this.PC.charisma - this.PC.charismaBoosted;
      this.PC.charismaBoosted = null;
    }

    if (this.PC.constitutionBoosted) {
      this.PC.constitution = this.PC.constitution - this.PC.constitutionBoosted;
      this.PC.constitutionBoosted = null;
    }
  }

  castAttackSpell(id: number, dc: number, special: string): boolean | number | string | undefined {
    switch (id) {
      case 1:
        let heal = new Audio();
        heal.src = '../assets/Sound Effects/heal.mp3';
        heal.load();
        heal.play();
        return 7;

      case 3:
        let hex = new Audio();
        hex.src = '../assets/Sound Effects/hex.mp3';
        hex.load();
        hex.play();
        if (this.skillCheck('wisdom', dc, special)) {
          let roll2 = Math.floor(Math.random() * (3 - 1 + 1) + 1);
          let outcome;
          roll2 === 1 ? outcome = 'frog' : roll2 === 2 ? outcome = 'puddle' : outcome = 'purple';
          return outcome;
        } else {
          return false;
        }
      case 4:
        let ice = new Audio();
        ice.src = '../assets/Sound Effects/ice-blast.mp3';
        ice.load();
        ice.play();
        return this.skillCheck('intelligence', dc, special);
      case 5:
        let green = new Audio();
        green.src = '../assets/Sound Effects/green-thumb.mp3';
        green.load();
        green.play();
        return true;

      case 9:
        let swing = new Audio();
        swing.src = '../assets/Sound Effects/hammer-swing.mp3';
        swing.load();
        swing.play();

        if (this.skillCheck('strength', dc, special)) {
          let hit = new Audio();
          hit.src = '../assets/Sound Effects/hammer-hit.mp3';
          hit.load();
          hit.play();
          return true;
        } else {
          return false;
        }

      case 8:
        let mend = new Audio();
        mend.src = '../assets/Sound Effects/mend.mp3';
        mend.load();
        mend.play();
        return true;
      default:
        return false;
    }
  }

  castSaveSpell(id: number, modifier: number, special: string) {
    let diceRoll = new Audio();
    diceRoll.src = "../assets/Sound Effects/rpg-dice-rolling-95182.mp3";
    diceRoll.load();
    diceRoll.play();

    let roll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    if (special === 'advantage') {
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if (secondRoll > roll) {
        roll = secondRoll;
      }
    } else if (special === 'disadvantage') {
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if (secondRoll < roll) {
        roll = secondRoll;
      }
    }
    switch (id) {
      case 2:
        let illusion = new Audio();
        illusion.src = '../assets/Sound Effects/illusion.mp3';
        illusion.load();
        illusion.play();
        return (roll + modifier) < Math.floor((this.PC.wisdom - 10) / 2) + 10;

      case 6:
        let cloud = new Audio();
        cloud.src = !this.PC.enhancedStink ? '../assets/Sound Effects/fart.mp3' : '../assets/Sound Effects/enhanced-fart.mp3';
        cloud.load();
        cloud.play();
        if (this.PC.enhancedStink) {
          return true;
        } else {
          let total = roll + modifier;
          return total < Math.floor((this.PC.constitution - 10) / 2) + 10;
        }

      case 7:
        let bomb = new Audio();
        bomb.src = '../assets/Sound Effects/bomb.mp3';
        bomb.load();
        bomb.play();
        this.removeItem(10);
        let total = roll + modifier;
        return total < Math.floor((this.PC.strength - 10) / 2) + 10;
      default:
        return false;
    }
  }
}
