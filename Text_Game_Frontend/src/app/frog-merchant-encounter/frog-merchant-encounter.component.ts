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
  public npcTag = 'Frog Merchant: ';

  public hasCountedFingers = false;
  public knowsHesFae = false;
  public hasCheckedFruits = false;
  public knowsTheFruitIsWeird = false;

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

    switch (event.id) {
      case 0:
        this.narration = "It feels like you\'ve barely entered the woods when you hear a voice suddenly call out to you.";
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_5.jpg";
        this.narration = '';
        this.dialogue.unshift(this.npcTag + '"Well howdy ho there partner. I bid thee greetings and welcome you most kindly into this fine forest." You turn to see a large frog in a straw hat sitting beside a cart filled with various fruits.');
        this.options = [
          { id: 2, text: '"Well howdy yourself, sir. I must say, you\'re a much friendlier face than I was expecting."' },
          { id: 3, text: '"Uh . . . hi there. Can I help you with something?" You ask, keeping up your guard.' },
          { id: 4, text: '"Dear . . . what sort of foul creature are you?"' },
          { id: 5, text: 'You eye the frog wearily, saying nothing. You remember the advice of the fortune teller and attempt to count his fingers. (Perception Check)' }
        ];
        break;
      case 2:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"And what, pray tell, were you expecting?" The frog asks with a hearty, croaking chuckle.');
        this.options = [
          { id: 6, text: '"Well, to be honest, I was told that these woods were quite dangerous. Filled with treacherous fiends and the like."' },
          { id: 7, text: '"I wasn\'t really sure what to expect."' },
          { id: 8, text: '"Just trees and beasts, mostly."' }
        ];
        break;
      case 3:
      case 4:
        this.addPCDialogue(event.text);
        let text = 'I\'m just your typical, run of the mill, honest, hardworking fella out here plying my wares." He gestures to the cart filled with fruit beside him. "Providing a service to the community of which I am apart, ya know?"';
        if (event.id === 4) {
          text = this.npcTag + '"Foul creature!" the frog bellows, grabbing onto his hat to keep it atop his head as he reels backward. "You do me a grave misservice, you do. ' + text;
        } else {
          text = this.npcTag + '"' + text;
        }
        this.dialogue.unshift(text);
        this.options = [
          { id: 12, text: '"I see. Why don\'t you tell me a little about your business here?"' },
          { id: 13, text: 'Cast your eyes over the fruit cart. See what the frog has for sale. (Invesigation Check)' }
        ];
        if (!this.hasCountedFingers) {
          this.options.push({ id: 5, text: 'You eye the frog wearily, saying nothing. You remember the advice of the fortune teller and attempt to count his fingers. (Perception Check)' });
        }
        break;
      case 5:
        this.hasCountedFingers = true;
        if (this.sharedService.skillCheck('wisdom', 2, 'none')) {
          this.knowsHesFae = true;
          this.dialogue.unshift('(Success!) This frog clearly has 5 fingers on his right hand, and four fingers on his left, and is surely a member of the Fae.');
          this.options[this.options.length - 1] = { id: 9, text: '"Can I ask why you have more fingers on your right hand than your left, Mr. Fae?"' };
        } else {
          this.dialogue.unshift('(Failure!) They look fine to you.');
          this.options.splice(this.options.length - 1);
        }
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.dialogue.unshift('The frog looks at his hands, seemingly just as surprised by what he sees as you were. "Uhhhhh . . . no I don\'t." He mutters as a puff of smoke surrounds him.');
        setTimeout(() => {
          let magic = new Audio();
          magic.src = "../assets/Sound Effects/sound-effect-twinklesparkle-115095.mp3";
          magic.load();
          magic.play();
          this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_shift.png";
          setTimeout(() => {
            this.portraitID = "../../assets/Final Picks/Characters/frog_merchant_4.jpg";
          }, 500);
        }, 4000);

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
      case 12:
        this.addPCDialogue(event.text);
        this.npcTag = 'Honest Melvin: ';
        this.dialogue.unshift(this.npcTag + '"Why certainly. But first, by the gods, where are my manners. Allow me to introduce myself. The name\'s Melvinfirth the Thirteenth. The Thirteenth part means that I have a family and the Melvinfirth part means that that\'s my name. But most folks just call me Honest Melvin, on account of how honest and trustworthy I am."');
        this.options = [
          { id: 14, text: '"Honest and trustowrthy . . . yes I believe you\'ve mentioned . . ."' },
          { id: 15, text: 'Say nothing, allow the frog to continue.' }
        ];
        break;
      case 13:
      case 18:
        this.hasCheckedFruits = true;
        if (this.sharedService.skillCheck('wisdom', 10, this.knowsHesFae ? 'advantage' : 'none')) {
          this.knowsTheFruitIsWeird = true;
          this.dialogue.unshift('(Success!) The objects on the cart look vaguely like fruits, but there\'s always something off. Never quite the right shape, size, or color.')
        } else {
          this.dialogue.unshift('(Failure!) They look quite exotic. They must be native to the forest. You\'re eager to try them.')
        }
        if (event.id === 13) {
          this.options.splice(1, 1);
        } else {
          this.options.splice(0, 1);
        }
        break;
      case 14:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Oh yes indeed. Why just the other day I was talking to my *human* friend that I have, and he said to me \'Melvin, you are just so trustworthy. That\'s why I buy all of my fruit from you, because I can just be so sure that it is *not* poisoned.\'"');
        this.options = [
          { id: 16, text: '"Well it\'s certainly important to buy fruit that hasn\'t been poisoned."' },
          { id: 16, text: '"Right . . . why don\'t you tell me about this fruit that is definitely *not* poisoned."' }
        ];
        break;
      case 15:
      case 16:
        let line = 'He gestures toward his cart. "Finest fruits you\'ll find in these merry woods. Picked them all myself. Get the very best ones from the top of the trees. You see I\'m very good at hopping and climbing, due to my being a frog."'
        if (event.id === 16) {
          this.addPCDialogue(event.text);
          line = '"Not poisoned, yes indeed. In fact, that\'s my guarantee. If you die of poison after eating my fruit, I\'ll give you your money back. Not going to get that promise anywhere else, no sir. And here they are." ' + line;
        } else {
          line = '"And these are my aforementioned wares." ' + line;
        }
        this.dialogue.unshift(this.npcTag + line);
        this.options = [
          { id: 17, text: '"And what sort of fruits are these?"' }
        ];
        if (!this.hasCheckedFruits) {
          this.options.unshift({ id: 18, text: 'Cast your eyes over the fruit cart. See what the frog has for sale. (Invesigation Check)' });
        }
        break;
      case 17:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Oh, I\'ve got all the best ones. Snozzlecherries. Doodleberries. Winga-wing-wams."');
        this.options = [
          { id: 19, text: 'Rack your brain to see if you\'ve ever heard of such fruits. (Nature Check)' },
          { id: 20, text: '"I\'ve never heard of any of those, must be rare."' }
        ]
        break;
      case 19:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('intelligence', 8, this.knowsTheFruitIsWeird ? 'advantage' : 'none')) {
          this.dialogue.unshift('(Success!) You feel absolutely certain that none of those are the names of fruits.');
          this.knowsTheFruitIsWeird = true;
        } else {
          this.dialogue.unshift('(Failure!) Those certainly sound like they *could* be fruits.')
        }
        this.options = [{ id: 20, text: '"I\'ve never heard of any of those, must be rare."' }];
        break;
      case 20:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"You don\'t say! Well they\'re practically a delicacy around these parts. Not a day goes by that I don\'t eat a winga-wing-wam." He grabs one from the cart and holds it out to you. "Here, a free sample. Just a little friendly hospitality to a new guest of our lands."')
        this.options = [
          { id: 21, text: '"Well that\'s mighty kind of you." You reach out and accept the fruit.' },
          { id: 22, text: '"Oh, I really don\'t think I should."' }
        ]
        break;
    }
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

}
