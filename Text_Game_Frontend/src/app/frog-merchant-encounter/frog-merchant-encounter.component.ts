import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-frog-merchant-encounter',
  templateUrl: './frog-merchant-encounter.component.html',
  styleUrls: ['./frog-merchant-encounter.component.css']
})
export class FrogMerchantEncounterComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;

  public hasCountedFingers = false;
  public knowsHesFae = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.sharedService.deboostStats();
      this.resetPC = JSON.parse(JSON.stringify(this.PC));
      this.narration = "You exit the tavern and stand at the precipice of the forest, the tree line beginning abruptly before you, an almost too clear path opened in front of you. You wonder what dangers await you, and what welcome the forest will grant you."
      this.options = [{ id: 0, text: 'Continue >' }];
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
        this.narration = "You exit the tavern and stand at the precipice of the forest, the tree line beginning abruptly before you, an almost too clear path opened in front of you. You wonder what dangers await you, and what welcome the forest will grant you."
        this.options = [{ id: 0, text: 'Continue >' }];
      })
    }
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You exit the tavern and stand at the precipice of the forest, the tree line beginning abruptly before you, an almost too clear path opened in front of you. You wonder what dangers await you, and what welcome the forest will grant you."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;

  }

  optionSelection(event: any) {
    let npcTag = 'Frog Merchant: ';
    switch (event.id) {
      case 0:
        this.narration = "It feels like you\'ve barely entered the woods when you hear a voice suddenly call out to you.";
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_5.jpg";
        this.narration = '';
        this.dialogue.unshift(npcTag + '"Well howdy ho there partner. I bid thee greetings and welcome you most kindly into this fine forest." You turn to see a large frog in a straw hat sitting beside a cart filled with various fruits.');
        this.options = [
          { id: 2, text: '"Well howdy yourself, sir. I must say, you\'re a much friendlier face than I was expecting."' },
          { id: 3, text: '"Uh . . . hi there. Can I help you with something?" You ask, keeping up your guard.' },
          { id: 4, text: '"Dear . . . what sort of foul creature are you?"' },
          { id: 5, text: 'You eye the frog wearily, saying nothing. You remember the advice of the fortune teller and attempt to count his fingers. (Perception Check)' }
        ];
        break;
      case 2:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"And what, pray tell, were you expecting?" The frog asks with a hearty, croaking chuckle.');
        this.options = [
          { id: 6, text: '"Well, to be honest, I was told that these woods were quite dangerous. Filled with treacherous fiends and the like."' },
          { id: 7, text: '"I wasn\'t really sure what to expect."' },
          { id: 8, text: '"Just trees and beasts, mostly."' }
        ];
        break;
      case 5:
        this.hasCountedFingers = true;
        if (this.sharedService.skillCheck('wisdom', 2, 'none')) {
          this.knowsHesFae = true;
          this.dialogue.unshift('(Success!) This frog clearly has 5 fingers on his right hand, and four fingers on his left, and is surely a member of the Fae.');
          this.options = [
            { id: 2, text: '"Well howdy yourself, sir. I must say, you\'re a much friendlier face than I was expecting."' },
            { id: 3, text: '"Uh . . . hi there. Can I help you with something?" You ask, keeping up your guard.' },
            { id: 4, text: '"Dear . . . what sort of foul creature are you?"' },
            { id: 9, text: '"Can I ask why you have more fingers on your right hand than your left, Mr. Fae?"' }
          ];
        } else {
          this.dialogue.unshift('(Failure!) They look fine to you.');
        }
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.dialogue.unshift('The frog looks at his hands, seemingly just as surprised by what he sees as you were. "Uhhhhh . . . no I don\'t." He mutters as a puff of smoke surrounds him.');
        let magic = new Audio();
        magic.src = "../assets/Sound Effects/sound-effect-twinklesparkle-115095.mp3";
        magic.load();
        magic.play();
        this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_shift.png";
        setTimeout(() => {
          this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_4.jpg";
        }, 500);
        this.options = [
          { id: 10, text: 'You count his fingers again. There\'s four on each hand, exactly what you\'d expect from a frog man. "Oh, so you don\'t. My mistake."' },
          { id: 11, text: 'Wait a minute, he definitely had five fingers on his right hand a second ago . . . right? (Wisdom Saving Throw)' }
        ]
        break;

      case 10:
        this.knowsHesFae = false;
        break;
      case 11:
        if (this.sharedService.skillCheck('wisdom', 10, 'none')) {
          this.dialogue.unshift('(Success!) Yes. He definitely did. He\'s a fae and he\'s not fooling you.');
        } else {
          this.knowsHesFae = false;
          this.dialogue.unshift('(Failure!) Well, I guess I just imagined that? Must be a little jittery is all.')
        }
        break;
    }
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

}
