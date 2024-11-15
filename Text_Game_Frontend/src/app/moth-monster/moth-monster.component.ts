import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-moth-monster',
  templateUrl: './moth-monster.component.html',
  styleUrls: ['./moth-monster.component.css']
})
export class MothMonsterComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Moth Monster: ';
  public setting = 1;
  public surprise: any;
  public fart: any;
  public skelly: any;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.sharedService.deboostStats();
      this.resetPC = JSON.parse(JSON.stringify(this.PC));

    } else {
      this.sharedService.getPCList().subscribe(data => {
        this.PC = data[1];
        this.PC.currentHealth = this.PC.hp;
        this.PC.hasShitPants = false;
        let gold: item = {
          itemID: 13,
          itemDescription: 'Can be exchanged for goods and services.',
          itemName: 'Gold',
          itemQuantity: 10,
          imageID: ''
        }
        this.PC.items.push(gold);
        this.sharedService.PC = this.PC;
        this.resetPC = JSON.parse(JSON.stringify(this.PC));
      })
    }
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. As you progress, the trees grow denser and taller. And as the light of the moon is incresingly blocked out by the canopy, the woods become darker and more ominous."
    this.options = [{ id: 0, text: 'Continue >' }];
    let strings = new Audio();
    this.surprise = strings;
    strings.src = "../assets/Sound Effects/surprise.mp3";
    strings.load();

    let fart = new Audio();
    this.fart = fart;
    fart.src = "../assets/Sound Effects/fart.mp3";
    fart.load();

    let skelly = new Audio();
    this.skelly = skelly;
    skelly.src = "../assets/Sound Effects/Xylophone Quick Gliss Down.mp3";
    skelly.load();
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. As you progress, the trees grow denser and taller. And as the light of the moon is incresingly blocked out by the canopy, the woods become darker and more ominous."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.setting = 1;
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  npcDialogue(text: string) {
    this.dialogue.unshift(this.npcTag + text);
  }

  optionSelection(event: any) {

    switch (event.id) {
      case 0:
        this.narration = "At the very least, it\'s quiet. In fact . . . maybe it\'s a little *too* quiet . . . ."
        this.options = [{ id: 1, text: 'Continue >' }]
        break;
      case 1:
        this.narration = 'Suddenly, a Moth Monster flies from the trees and swoops straight at you!';
        this.surprise.play();
        setTimeout(() => {
          this.setting = 2;
        }, 150);
        this.options = [{ id: 2, text: 'Try to contain your fear (Constitution Saving Throw)' }];
        break;
      case 2:
        if (this.sharedService.skillCheck('constitution', 15, this.PC.pcid === 2 ? 'disadvantage' : 'none')) {
          this.narration = '(Success!) You fall to the ground in fear, but manage to hold yourself together.';
          this.options = [{ id: 3, text: 'Continue >' }];
        } else {
          if (this.PC.pcid === 1) {
            this.skelly.play();
            this.narration = '(Failure!) The fear is overwhelming. You collapse to the ground in a heap of bones, all discombobulated.'
            this.options = [{ id: 4, text: 'Continue >' }]
          } else {
            this.fart.play();
            this.PC.hasShitPants = true;
            this.narration = '(Failure!) You poop your pants. You poop your pants so bad.';
            this.options = [{ id: 5, text: 'Continue >' }]
          }

        }
        break;
      case 3:
        this.setting = 1;
        this.narration = '"Hoo hoo hoo, hee hee hee, you\'ve not seen the last of me!" the Moth Monster cackles as they fly away into the night.';
        this.options = [{ id: 6, text: 'Dust yourself off and continue into the woods.' }];
        break;
      case 4:
        this.setting = 1;
        this.narration = '"Slow of wit and faint of heart, little skelly\'s fallen apart! the Moth Monster cackles as they fly away into the night.';
        this.sharedService.takeDamage(5);
        this.options = [{ id: 7, text: 'Try to put yourself back together (Dexterity Slight of Hand Check)' }];
        break;
      case 5:
        this.setting = 1;
        this.narration = 'Hee hee hee, hoo hoo hoo, I made you go poo poo poo! the Moth Monster cackles as they fly away into the night.';
        this.options = [{ id: 6, text: '"Well shit . . ." you mutter. You dust yourself off and continue on your journey, your resolve slightly shaken, your trousers thoroughly soiled.' }];
        break;
      case 6:
        if (this.sharedService.encounters[2] === 'DF1') {
          this.router.navigate(['/traveller']);
        } else {
          this.router.navigate(['/illusionist']);
        }
        console.log(this.PC);
        break;
      case 7:
        if (this.sharedService.skillCheck('dexterity', 10, 'none')) {
          this.narration = '(Success!) With skilled and practiced hands, you put all your bones back in the right places. You\'re still a bit embarrassed, but you feel a litle better.';
          this.PC.currentHealth = this.PC.currentHealth + 5;
        } else {
          this.narration = '(Failure!) Still shaken from the fright, you do a poor job reassembling yourself. You can still continue your journey, but you you definitely feel a bit wonky. (Dexterity -2)';
          this.PC.dexterity = this.PC.dexterity - 2;
        }
        this.options = [{ id: 6, text: 'Pick yourself up and continue into the woods.' }];

    }
  }

}
