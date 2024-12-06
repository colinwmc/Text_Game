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
  public hasIntroducedHimself = false;
  public hasFixedFingers = false;

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
        this.PC = data[0];
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
    this.hasCountedFingers = false;
    this.knowsHesFae = false;
    this.hasCheckedFruits = false;
    this.knowsTheFruitIsWeird = false;
    this.hasIntroducedHimself = false;
    this.hasFixedFingers = false;

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
          { id: 5, text: 'You eye the frog wearily, saying nothing. You remember the advice of the fortune teller and attempt to count his fingers. (Wisdom Perception Check)' }
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
        this.hasIntroducedHimself = true;
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
          { id: 13, text: 'Cast your eyes over the fruit cart. See what the frog has for sale. (Intelligence Invesigation Check)' }
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
      case 6:
      case 7:
      case 8:
        this.addPCDialogue(event.text);
        let beginning = '';
        if (event.id === 6) {
          beginning = '"Treacherous fiends!" the frog yelps, laughing uncontrollably. "Well whoever told you that? No, we don\'t have nothing like that around here. J'
        } else if (event.id === 7) {
          beginning = '"Well it\'s j'
        } else {
          beginning = '"Well we\'ve got plenty of that, but mostly it\'s j'
        }
        this.dialogue.unshift(this.npcTag + beginning + 'ust a quiet little neck of the woods filled with decent folks is all."');
        this.options = [
          { id: 3, text: '"Well that\'s certainly a relief. Is there anything I can do for you, sir?"' },
          { id: 3, text: '"Hmmm" you say, scrathing your chin. "Perhaps I\'ve been misled. What are you doing out here anyways?"' }
        ]
        if (!this.hasCountedFingers) {
          this.options.push({ id: 5, text: 'You eye the frog wearily, saying nothing. You remember the advice of the fortune teller and attempt to count his fingers. (Wisdom Perception Check)' });
        }
        break;
      case 9:
        this.hasFixedFingers = true;
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + 'The frog looks at his hands, seemingly just as surprised by what he sees as you were. "Uhhhhh . . . no I don\'t." He mutters as a puff of smoke surrounds him.');
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
        this.dialogue.unshift(this.npcTag + '"Oh that\'s no worry. Folks make mistakes, just as sure as I\'ve got four fingers on each hand."')
        if (this.hasIntroducedHimself) {
          this.options = [{ id: 12, text: '"Why don\'t you tell me a little about your business here?"' },]
        } else {
          this.options = [
            { id: 3, text: '"Is there anything I can do for you, sir?"' },
            { id: 3, text: '"What are you doing out here anyways?"' }
          ];
        }
        break;
      case 11:
        if (this.sharedService.skillCheck('wisdom', 10, 'none')) {
          this.dialogue.unshift('(Success!) Yes. He definitely did. He\'s a fae and he\'s not fooling you.');
        } else {
          this.knowsHesFae = false;
          this.dialogue.unshift('(Failure!) Well, I guess I just imagined that? Must be a little jittery is all.')
        }
        if (this.hasIntroducedHimself) {
          this.options = [{ id: 12, text: '"Why don\'t you tell me a little about your business here?"' },]
        } else {
          this.options = [
            { id: 3, text: '"Is there anything I can do for you, sir?"' },
            { id: 3, text: '"What are you doing out here anyways?"' }
          ];
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
          this.options.unshift({ id: 18, text: 'Cast your eyes over the fruit cart. See what the frog has for sale. (Intelligence Invesigation Check)' });
        }
        break;
      case 17:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Oh, I\'ve got all the best ones. Snozzlecherries. Doodleberries. Winga-wing-wams."');
        this.options = [
          { id: 19, text: 'Rack your brain to see if you\'ve ever heard of such fruits. (Intelligence Nature Check)' },
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
      case 21:
      case 42:
        let hasFruit = false;
        for (let item of this.PC.items) {
          if (item.itemID === 17) {
            hasFruit = true;
          }
        }
        if (!hasFruit) {
          let fruit: item = {
            itemID: 17,
            itemDescription: 'A strange fruit you got from a frog.',
            itemName: 'Winga-wing-wam',
            itemQuantity: 1,
            imageID: ''
          }
          this.PC.items.push(fruit);
        }
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + (event.id === 21 ? '"Oh, it\'s my absolute pleasure. ' : '"Oh, nonsense. ') + 'In fact, why don\'t you eat it right now? I\'d love to see the look on your face when you bite into your first winga-wing-wam."');
        if (!this.knowsHesFae && !this.knowsTheFruitIsWeird) {
          this.options = [{ id: 23, text: '"I literally can\'t think of a single reason why not." You take a large, enthusiastic bite out of the fruit.' }]
        } else {
          this.options = [
            { id: 43, text: '"You know, I absolutely would . . . but I can\'t really eat fruit. It gives me crazy bad farts." (Charisma Deception Check)' },
            { id: 44, text: '"As mush as I appreciate your gracious hospitality, I actually can\'t eat this fruit. I\'m a devout Selunite. We can\'t eat after midnight." (Intelligence Religion Check)' },
            { id: 45, text: '"Well I\'ll eat it if you eat it with me. You do have one everyday afterall, right?" (Charisma Persuasion Check)' }
          ];
        }
        break;
      case 22:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Oh of course you should! And I really must insist. You would insult my honor as your host in this fine forest!" The frog grabs your hand and pushes the fruit into it.');
        let fruit1: item = {
          itemID: 17,
          itemDescription: 'A strange fruit you got from a frog.',
          itemName: 'Winga-wing-wam',
          itemQuantity: 1,
          imageID: ''
        }
        this.PC.items.push(fruit1);
        this.options = [
          { id: 42, text: '"Well I do thank you for your hospitality," you say, taking the fruit, "but I really must be going . . ."' },
          { id: 29, text: '"I said I don\'t want it." You state firmly handing it back to the frog.' }
        ]
        break;
      case 23:
      case 30:
      case 54:
        this.addPCDialogue(event.text);
        if (event.id === 23) {
          this.sharedService.useItem(17);
        } else {
          this.sharedService.takeDamage(5);
        }
        let first = event.id === 54 ? 'The frog\'s fruit dissapears in a puff of smoke just before it touches his lips. Yours does not. ' : '';
        this.dialogue.unshift(this.npcTag + first + '"Ooh hoo hoo! They actually did it! They ate the poison!" The frog says, hopping giddily. "This is my lucky day!"');
        this.options = [
          { id: 24, text: '"Oh dear . . ."' },
          { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
        ];
        break;
      case 24:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Hee hee hee"');
        this.sharedService.takeDamage(10);
        break;
      case 25:
        if (this.sharedService.skillCheck('constitution', 15, 'none')) {
          this.dialogue.unshift('(Success!) You vomit specatularly. It sprays out in front of you like a technicolored firehose. The frog is thoroughly covered.');
          this.options = [
            { id: 26, text: '"uuuuuugggghhhhh" you moan pathetically.' }
          ]
        } else {
          this.dialogue.unshift('(Failure!) You can\'t bring yourself to do it. Despite it\'s wretched nature, the fruit is sweet and succulent as the last of it slides down your throat. "So delighted to have you in the forest!" The frog mocks you as your vision tunnels.');
          this.options = [
            { id: 27, text: '"uuuuuugggghhhhh" you moan pathetically.' }
          ]
        }
        break;
      case 26:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"WHAT IN TARNATION!? You weren\'t supposed to do all that! You were just supposed to die. You completely ruined my joke! Wretched, no good mortals . . ." the frog mutters as he hops away.');
        this.options = [
          { id: 28, text: '"Well . . . lessons learned there, I suppose." Pick yourself up and continue deeper into the forest.' }
        ]
        break;
      case 27:
        this.sharedService.takeDamage(10);
        break;
      case 28:
        // if (this.sharedService.encounters[1] === 'MF1') {
        //   this.router.navigate(['/moth']);
        // } else {
        //   this.router.navigate(['/vamp']);
        // }
        this.router.navigate(['seductress']);
        break;
      case 29:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + '"Oh you don\'t want it do you?" The frog states incredulously. "Well I certainly don\'t know what I or this forest, both of which have treated you with nothing less than glowing hospitality, have done to offend you so deeply that you would offer this disrespect to us. Would you really break my poor, froggy heart over this bit of fruit?"');
        this.options = [
          { id: 23, text: '"Oh dear, I didn\'t mean to offend you so. Here, I\'ll eat the fruit." Take a bit of the fruit.' },
          { id: 30, text: '"Well  . . . I am unaware of your customs, and I wouldn\'t want to offend." Take a tiny bite of the fruit.' },
          { id: 31, text: '"No, don\'t cry little frog. Look! I\'m eating the fruit." Pretend to eat the fruit while actually dropping it into your backpack behind you. (Charisma Performance Check)' },
          { id: 32, text: '"Sure I would. I don\'t give a shit about you." Drop the fruit on the ground.' }
        ]
        break;
      case 31:
      case 53:
      case 55:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 15, event.id === 53 ? 'disadvantage' : event.id === 31 ? 'none' : 'advantage')) {
          if (event.id === 55) {
            this.dialogue.unshift('(Success!) The frog causes his fruit to dissappear as soon as it reaches his lips, but misses your trick entirely.')
          } else {
            this.dialogue.unshift('(Success!) The frog stares at you expectantly with big, excited eyes.');
          }
          this.options = [
            { id: 33, text: '"Mmmmm. Delicious." You say rubbing your stomach. "Thank you so much Mr. Melvinfirth. See you around!"' },
            { id: 33, text: '"Welp. That sure tasted like fruit, or whatever. Anyway, smell ya later, nerd."' }
          ]
        } else {
          this.dialogue.unshift('(Failure!) The fruit misses the opening to your bag and thunks to the ground between your feet.');
          this.sharedService.removeItem(17);
          this.dialogue.unshift(this.npcTag + '(Failure!) "Uh . . . it looks like you dropped it there."');
          this.options = [
            { id: 52, text: 'Run for it! (Strength Athletics Check)' }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 37, text: 'Hit that fae with a hex! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 38, text: 'Blast that fae! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 40, text: 'Bring down the hammer on this fool. (Melee Attack: Hammer)' });
          }
        }
        break;
      case 32:
        this.sharedService.removeItem(17);
        this.addPCDialogue(event.text);
        this.dialogue.unshift('As you stride past the frog, his jaw dropped to the floor, you hear a noise from behind you. The creature has scooped the fruit from the floor and launched himself toward you on his powerful amphibian legs.');
        this.options = [
          { id: 34, text: 'Dodge the Frog! (Dexterity Saving Throw)' }
        ]
        break;
      case 33:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(this.npcTag + 'The frog\'s jaw drops as he stares at you, utterly confused. He picks up another fruit and looks it over then looks back up at you with wide eyes.');
        this.options = [
          { id: 28, text: 'Stride confidently past the frog and deeper into the forest.' }
        ]
        break;
      case 34:
        if (this.sharedService.skillCheck('dexterity', 12, 'none')) {
          this.dialogue.unshift('(Success!) You lunge out of the way and the fae plops to the ground behind you, momentrily vulnerable.');
          this.options = [
            { id: 35, text: 'Run for it! (Strength Athletics Check)' }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 36, text: 'Cast an illusion to cover your escape. (Spell Cast: Illusion)' });
            this.options.push({ id: 37, text: 'Hit that fae with a hex! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 38, text: 'Blast that fae! (Spell Attack: Ice Blast)' });
            this.options.push({ id: 39, text: 'Lay down a stinking cloud to cover your escape. (Spell Cast: Stinking Cloud)' })
          } else {
            this.options.push({ id: 40, text: 'Bring down the hammer on this fool. (Melee Attack: Hammer)' });
            this.options.push({ id: 41, text: 'Throw a fire bomb. Blow him to smithereens! (Ranged Attack: Fire Bomb)' })
          }
        } else {
          this.dialogue.unshift('(Failure!) The frog lands right on your shoulders. He takes the fruit and shoves it into your mouth.');
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }
        break;
      case 35:
      case 52:
        if (this.sharedService.skillCheck('strength', 10, event.id === 35 ? 'advantage' : 'disadvantage')) {
          if (event.id === 35) {
            this.dialogue.unshift('(Success!) You flee from the frustrated fae. You look back over your shoulder to see him  still sat on the ground, shaking a fist at you.');
          } else {
            this.dialogue.unshift('(Success!) He pursues as quick as he can, but eventually he stumbles to the ground. He shakes a fist at you dramatically as you make your escape.')
          }
          this.options = [{ id: 28, text: 'Continue deeper into the forest.' }];
        } else {
          this.dialogue.unshift('(Failure!) The frog scoops up a fruit and jumps after you on his, powerful amphibian legs, landing right on your shoulders. He takes the fruit and shoves it into your mouth.');
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }
        break;
      case 36:
        //illusion
        if (this.sharedService.castSaveSpell(2, -2, 'none')) {
          this.dialogue.unshift('(Success!) You create the image of a ghostly figure that springs out of the ground. The frog yelps and cowers on the ground.');
          this.options = [
            { id: 28, text: 'You cling Priscilla tight as you silently run deeper into the woods' },
            { id: 28, text: '"Smell ya later!" You shout over your shoulder as you flee deeper into the woods.' }
          ]
        } else {
          this.dialogue.unshift('(Failure!) The frog stares straight at you through the translucent figure, then launches himself at you again, shoving the fruit into your mouth.');
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }
        break;
      case 37:
      case 46:
      case 49:
        //hex
        let outcome = this.sharedService.castAttackSpell(3, 10, event.id === 37 ? 'advantage' : event.id === 46 ? 'none' : 'disadvantage')
        if (outcome === 'frog') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits him in the chest. His body is twisted and morphed into a frog! Well, a different frog. Not a talking fae frog in a hat, just a normal frog.');
          this.portraitID = "../../assets/Final Picks/Characters/hex-frog.jpg";
          this.options = [
            { id: 28, text: '"Well, that takes care of that then." You saying striding deeper into the woods.' },
            { id: 28, text: '"Uh . . . hopefully you don\'t mind being a different sort of frog, Melvin." You sidle past the frog, and continue onwards' }
          ]
        } else if (outcome === 'puddle') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits him in the chest. The frog cries out as his body is slowly, horrifically disolved into a sparkly, indigo puddle.');
          this.frogDies();
          this.options = [
            { id: 28, text: '"Oh . . . oh gods. I\'m so sorry." You saying stepping over the puddle, travelling deeper into the woods.' },
            { id: 28, text: '"Rest in pepperonis, Melvin." You solemnly step over him and continue on your way.' },
            { id: 56, text: 'Collect a bit of his sparkly, fae blood.' }
          ]
        } else if (outcome === 'purple') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits him in the chest. The frog cries out in fear, waiting for his doom. A second later, he looks at his hands in shock. "You . . . you made me purple, you little shit!" He yells, launching himself at you, blind with rage, and shoves the fruit into your mouth.');
          this.portraitID = this.hasFixedFingers ? "../../assets/Final Picks/Characters/frog_merchant_4_purple.jpg.png" : "../../assets/Final Picks/Characters/frog_merchant_5_purple.jpg.png";
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }
        else {
          this.dialogue.unshift('(Miss!) A bolt of magic flies from your fingertips and soars just above his shoulder. He lunges as you, launching himself forward on his powerful, amphibean legs.');
          this.options = [
            { id: 34, text: 'Dodge the Frog! (Dexterity Saving Throw)' }
          ]
        }
        break;
      case 38:
      case 47:
      case 50:
        //ice blast
        if (this.sharedService.castAttackSpell(4, 10, event.id === 38 ? 'advantage' : event.id === 47 ? 'none' : 'disadvantage')) {
          this.dialogue.unshift('(Hit!) A shard of ice flies from your finger tips and impales the frog straight through the chest. Sparkly, indigo blood pools on the ground around his dead body.');
          this.frogDies();
          this.options = [
            { id: 28, text: '"Well, that takes care of that then." You saying striding deeper into the woods.' },
            { id: 28, text: '"Rest in pepperonis, Melvin." You solemnly step over him and continue on your way.' },
            { id: 56, text: 'Collect a bit of his sparkly, fae blood.' }
          ]
        } else {
          this.dialogue.unshift('(Miss!) A shard of ice flies from your finger tips and soars just above his shoulder. He lunges as you, launching himself forward on his powerful, amphibean legs.');
          this.options = [
            { id: 34, text: 'Dodge the Frog! (Dexterity Saving Throw)' }
          ]
        }
        break;
      case 39:
        //stinking cloud
        if (this.sharedService.castSaveSpell(6, 0, 'none')) {
          if (this.PC.enhancedStink) {
            this.dialogue.unshift('(Success!) A massive noise echoes throughout the forest. The frog attempts to flee as the foul, green cloud surrounds him, but there\'s no hope. He breaths in the gas, collapses to the ground, and dies.');
            this.frogDies();
            this.options = [
              { id: 28, text: '"Oh dear . . . what a way to go. . . Oh well." You say making your way further into the woods.' }
            ]
          } else {
            this.dialogue.unshift('(Success!) The foul, green cloud surrounds the frog and he begins coughing uncontrollably.');
            this.options = [
              { id: 28, text: '"Smell ya later!" You shout over your shoulder as you flee deeper into the woods.' }
            ]
          }
        } else {
          this.dialogue.unshift('(Failure!) The frog breaths in the foul, green gas, steels himself, then launches himself at you again, shoving the fruit into your mouth.');
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }

        break;
      case 40:
      case 48:
      case 51:
        //hammer
        if (this.sharedService.castAttackSpell(9, 10, event.id === 40 ? 'advantage' : event.id === 48 ? 'none' : 'disadvantage')) {
          this.dialogue.unshift('(Hit!) Your hammer slams down on his head, splitting it like a grape. Sparkly, indigo blood pools on the ground around his dead body.');
          this.frogDies();
          this.options = [
            { id: 28, text: '"Get wrecked." You saying striding deeper into the woods.' },
            { id: 28, text: '"Sorry \'bout it bruh." You solemnly step over him and continue on your way.' },
            { id: 56, text: 'Collect a bit of his sparkly, fae blood.' }
          ]
        } else {
          this.dialogue.unshift('(Miss!) You swing with all your might, but he dodges back at the last second. He lunges as you, launching himself forward on his powerful, amphibean legs.');
          this.options = [
            { id: 34, text: 'Dodge the Frog! (Dexterity Saving Throw)' }
          ]
        }
        break;
      case 41:
        //fire bomb
        if (this.sharedService.castSaveSpell(7, 4, 'none')) {

          this.dialogue.unshift('(Hit!) The bomb detonates right at his feet. He lets out a tiny croak before he splatters. His sparkly, indigo blood covering every surface in sight.');
          this.frogDies();
          this.options = [
            { id: 28, text: '"Get wrecked." You saying striding deeper into the woods.' },
            { id: 28, text: '"Sorry \'bout it bruh." You solemnly step over him and continue on your way.' },
            { id: 56, text: 'Collect a bit of his sparkly, fae blood.' }
          ]

        } else {
          this.dialogue.unshift('(Miss!) The frog jumps dramatically out of the way, clings breifly to a nearby tree, then launches himself at you again, shoving the fruit into your mouth.');
          this.sharedService.takeDamage(10);
          this.options = [
            { id: 24, text: '"Oh dear . . ."' },
            { id: 25, text: 'Try your best to throw up, it\'s probably your only hope. (Constitution Saving Throw)' }
          ];
        }
        break;
      case 43:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 18, 'none')) {
          this.dialogue.unshift(this.npcTag + '(Success!) "Oh . . . bad farts you say. Well I suppose I wouldn\'t want to be downwind from that." He says, dejectedly.');
          this.options = [
            { id: 28, text: 'Stride confidently past the frog and deeper into the forest.' },
            { id: 28, text: '"Thanks again for you hospitality, I\'ll be sure to pass the fruit along to someone special."' },
            { id: 28, text: '"Welp, smell ya later."' }
          ]
        } else {
          setTimeout(() => {
            let fart = new Audio();
            fart.src = "../assets/Sound Effects/fart.mp3";
            fart.load();
            fart.play();
          }, 1500);
          this.dialogue.unshift(this.npcTag + '(Failure!) "Oh there\'s nothing wrong with farting among friends," he says, farting. "Take a bite, I\'m sure you\'ll agree it\'s worth it."');
          this.options = [
            { id: 35, text: 'Run for it! (Strength Athletics Check)' },
            { id: 30, text: '"Uh . . . ok then." Take a tiny bite of the fruit.' },
            { id: 31, text: 'Pretend to eat the fruit while actually dropping it into your backpack behind you. (Charisma Performance Check)' },
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 46, text: 'Attack! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 47, text: 'Attack! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 48, text: 'Attack!. (Melee Attack: Hammer)' });
          }
        }
        break;
      case 44:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('intelligence', 12, 'none')) {
          this.dialogue.unshift(this.npcTag + '(Success!) "Oh, well, I spose you would\'t want to get caught chowing down in front of your lady the moon." He says, despondantly looking up at the full moon between the trees. "Make sure you eat it first thing in the morning though!"');
          this.options = [
            { id: 28, text: '"Oh I sure will. You take care now."' },
            { id: 28, text: '"Sure, whatever. Smell ya later."' }
          ]
        } else {
          this.dialogue.unshift(this.npcTag + '(Failure!) "Selunites worship the moon. I figure they like to do just about everything at night." His eyes narrow as he looks you directly in the eye.');
          this.options = [
            { id: 52, text: 'Run for it! (Strength Athletics Check)' },
            { id: 30, text: '"Uh . . . ok then." Take a tiny bite of the fruit.' },
            { id: 53, text: 'Pretend to eat the fruit while actually dropping it into your backpack behind you. (Charisma Performance Check)' },
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 49, text: 'Attack! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 50, text: 'Attack! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 51, text: 'Attack!. (Melee Attack: Hammer)' });
          }
        }
        break;
      case 45:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 15, 'none')) {
          this.dialogue.unshift(this.npcTag + '"Oh . . . uh, I guess that sounds reasonable." He says, picking up a fruit, fear in his eyes.');
          this.options = [
            { id: 54, text: '"Uh . . . ok then." Take a tiny bite of the fruit.' },
            { id: 55, text: 'Pretend to eat the fruit while actually dropping it into your backpack behind you. (Charisma Performance Check)' },
          ];
        } else {
          this.dialogue.unshift(this.npcTag + '(Failure!) "Oh, I couldn\'t possibly. Forest custom dictates the guest must always eat first."');
          this.options = [
            { id: 52, text: 'Run for it! (Strength Athletics Check)' },
            { id: 30, text: '"Uh . . . ok then." Take a tiny bite of the fruit.' },
            { id: 53, text: 'Pretend to eat the fruit while actually dropping it into your backpack behind you. (Charisma Performance Check)' },
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 49, text: 'Attack! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 50, text: 'Attack! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 51, text: 'Attack!. (Melee Attack: Hammer)' });
          }
        }
        break;
      case 56:
        let blood: item = {
          itemID: 18,
          itemDescription: 'A small vial of sparkly, fae blood.',
          itemName: 'Vial of Fae Blood',
          itemQuantity: 1,
          imageID: ''
        }

        this.PC.items.push(blood);
        this.options.splice(this.options.length - 1);
        break;
    }
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  frogDies() {
    this.portraitID = this.hasFixedFingers ? "../../assets/Final Picks/Characters/frog_merchant_4_dead.jpg" : "../../assets/Final Picks/Characters/frog_merchant_5_dead.jpg";
  }

}
