import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-fortune-tellers-room',
  templateUrl: './fortune-tellers-room.component.html',
  styleUrls: ['./fortune-tellers-room.component.css']
})
export class FortuneTellersRoomComponent implements OnInit {
  public PC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;

  public hasAskedAboutNature = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.narration = "The feeling in the air changes immeadiately as you pass through the threshold of the back room. You see a small, dark room, lit only by candles. As the door swings shut, seemingly of its own accord, gone is the chatter of guests, and with it their uninviting glares. In its place, a single figure sits at the table in front of you, affixing you with a piercing gaze."
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
        this.narration = "The feeling in the air changes immeadiately as you pass through the threshold of the back room. You see a small, dark room, lit only by candles. As the door swings shut, seemingly of its own accord, gone is the chatter of guests, and with it their uninviting glares. In its place, a single figure sits at the table in front of you, affixing you with a piercing gaze."
        this.options = [{ id: 0, text: 'Continue >' }];
      })
    }
  }

  optionSelection(event: any) {
    let npcTag = 'Madame LeSoule: ';
    switch (event.id) {
      case 0:
        this.portraitID = "../../assets/Final Picks/Characters/fortune_teller.png";
        this.narration = '';
        this.dialogue.unshift(npcTag + '"Hello, my dear. Please, take a seat."');
        this.options = [
          { id: 1, text: '"Hello. My name is ' + this.PC.name + '. I\'m here about the artifact." You say, pulling the ad from your pocket.' },
          { id: 2, text: '"I\'m guessing you already know why I\'m here." You say, gesturing toward the cards on the table.' }
        ];
        break;
      case 1:
      case 2:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Yes, yes, of course, dear.' + (event.id === 1 ? ' I know. ' : ' ') + 'I\'ve been expecting you. Let me begin by thanking you for your assistance in this . . . delicate matter."');
        this.options = [
          { id: 3, text: '"Well, I\'m happy to help."' },
          { id: 4, text: '"I\'ll be thanking you when I get that 500 gold."' },
          { id: 5, text: '"I haven\'t actually agreed to do anything yet."' },
        ]
        break;
      case 3:
      case 4:
      case 5:
        this.addPCDialogue(event.text);
        let opening = event.id === 3 ? '"Such an altruistic soul, aren\'t you?" She says with a slight smirk. ' : event.id === 4 ? '"Yes, I\'m not surprised that caught your attention." She says, dryly. ' : '"Well you certainly didn\'t walk all this way just for a light chat, did you sweetheart?" She says, arching an eyebrow in your direction. ';
        this.dialogue.unshift(npcTag + opening + '"As you can imagine this artifact is an object of great importance to me. Proportionate to its reward. What you\'re looking for is going to look like this." She holds out a yellowed piece of parchment, on it is a drawing of a small, wooden box. On its front, it bears a metal latch beneath an emblem of a bird.');
        this.options = [
          { id: 6, text: '"What is the nature of this artifact?"' },
          { id: 7, text: '"And how did it end up . . . misplaced?"' }
        ];
        break;
      case 6:
        this.hasAskedAboutNature = true;
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag+'"Let\'s call it a . . . family heirloom. An object of great *sentimental* value to me."');
        break;
      case 7:
        this.addPCDialogue(event.text);
        break;
      default:
        break;
    }
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }
}
