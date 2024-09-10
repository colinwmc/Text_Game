import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-tavern',
  templateUrl: './tavern.component.html',
  styleUrls: ['./tavern.component.css']
})
export class TavernComponent implements OnInit {

  public PC: any;
  public currentNarration: string = '';
  public currentDialogue: any[] = [];
  public currentOptions: any[] = [];
  public portraitID: string = '';
  public number: number = 1;
  public smiledDisarmingly = false;
  public backpackOpen = false;
  public hasAskedAboutArea = false;
  public hasLearnedAboutMadame = false;
  public hasShopped = false;
  public hasAskedAboutMadame = false;
  public hasAskedAboutConcern = false;
  public hasAskedAboutFae = false;
  public hasTriedCharm = false;
  public commentedOnTaters = false;


  // public hasContinue = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.currentNarration = "You open the door to reveal a small, wooden room; half lit, half full. Provincial figures look up from their beer and potatoes to cast you " + (this.PC.pcid === 1 ? "fearful looks. Each averting their eyes as soon as they see you." : "suspicious looks.") + "  The bartender fixes you with an empty stare, before reluctantly waving you over."
      this.currentOptions = [{ ID: 'TV0', text: 'Continue >' }];
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
        console.log(this.PC);
        this.sharedService.PC = this.PC;
        this.currentNarration = "You open the door to reveal a small, wooden room; half lit, half full. Provincial figures look up from their beer and potatoes to cast you " + (this.PC.pcid === 1 ? "fearful looks. Each averting their eyes as soon as they see you." : "suspicious looks.") + "  The bartender fixes you with an empty stare, before reluctantly waving you over."
        this.currentOptions = [{ ID: 'TV0', text: 'Continue >' }];
      })
    }


  }

  optionSelection(event: any) {
    let npcTag = 'Bartender: ';
    let successfulPurchaseLine = '"Thank you, kindly."'
    let unsuccessfulPurchaseLine = '"It does\'t look like you\'ve got the money for that, mate."'
    switch (event.ID) {
      case 'TV0':
        this.currentNarration = '';
        this.portraitID = "../../assets/Final Picks/Characters/bartender.png";
        if (this.PC.pcid === 1) {
          this.currentDialogue.unshift('Bartender: "What do you need? We . . . Don\'t want any trouble."');
          this.currentOptions = [
            { ID: 'TV1', text: '"Oh dear. Why would there be any trouble?"' },
            { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
            { ID: 'TV3', text: 'You mean no harm. Try to put the man at ease by smiling in a reassuring manner. (Charisma Check)' }
          ]
        } else {
          this.currentDialogue.unshift('Bartender: "Howdy Stranger," he says, flatly. "What can I do for you?"')
          this.currentOptions = [
            { ID: 'TV15', text: '"Uh . . . Hi."' },
            { ID: 'TV16', text: '"Salutations!"' },
            { ID: 'TV17', text: '"Good evening, fine barkeep. I come in search of one called Madame LeSoule."' },
            { ID: 'TV18', text: '"Damn, them taters smellin\' good in here."' },
          ]
        }

        break;
      case 'TV1':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Well hopefully there won\'t be." He says, eyeing you suspiciously yet curiously. "Now what did you *need*?"');
        this.currentOptions = [
          { ID: 'TV4', text: '"I am a brave adventurer, and I\'m here to . . . um . . . bravely adventure."' },
          { ID: 'TV2', text: '"I\'m looking for someone named Madame LeSoule."' },
          { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
          { ID: 'TV5', text: '"Well I\'m not here to eat your children, if that\'s what you\'re worried about." You say dryly, raising an eyebrow you don\'t have.' },
        ]
        break;
      case 'TV2':
        this.hasLearnedAboutMadame = true;
        if (event.text.includes('"')) {
          this.addPCDialogue(event.text);
        }
        if (this.smiledDisarmingly) {
          this.currentDialogue.unshift(npcTag + '"Oh . . . I see." He eyes you uneasily. Clearly you weren\'t what he expected when the ads went up. "She\'s back through there." He points down a small, dark hallway with a wooden door at the end. "Did you need anything else?"');
          this.currentOptions = [
            { ID: 'TV8', text: '"No, Thanks." You mutter sheepishly before turning for the door.' },
            { ID: 'TV9', text: '"Do you have anything to sell?"' },
            { ID: 'TV10', text: '"What can you tell me about the area."' },
          ]
        } else {
          this.currentDialogue.unshift(npcTag + '"Oh . . . I see." He eyes you uneasily. Clearly you weren\'t what he expected when the ads went up. "She\'s back through there." He points down a small, dark hallway with a wooden door at the end.');
          this.currentOptions = [
            { ID: 'TV8', text: '"Thanks." You mutter sheepishly before turning for the door.' },
            { ID: 'TV8', text: 'Turn from the man wordlessly and walk through the mysterious door.' },
          ];
        }
        break;
      case 'TV3':
        if (this.sharedService.skillCheck('charisma', 15, 'none')) {
          this.smiledDisarmingly = true;
          this.currentDialogue.unshift('(Success!) He chuckles uncomfortably. He\'s not sure what to make of you, but appears more confused than afraid. A mild improvement. "Can I . . . help you?"');
          this.currentOptions = [
            { ID: 'TV4', text: '"I am a brave adventurer, and I\'m here to . . . um . . . bravely adventure."' },
            { ID: 'TV2', text: '"I\'m looking for someone named Madame LeSoule."' },
            { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
          ];
        } else {
          this.currentDialogue.unshift('(Failure!) His eyes widen as he takes a step back. He appears to reach for something under the bar.');
          this.currentOptions = [
            { ID: 'TV7', text: 'Raise your hands as if to indicate surrender.' },
            { ID: 'TV7', text: 'Raise your hands as if to curse his mortal soul.' },
            { ID: 'TV2', text: '"I\'m sorry . . . I . . . I just want . . ." Take the quest flyer and place it gently on the bar.' },
          ];
        }
        break;
      case 'TV4':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"And . . . what exact direction were you looking to take that adventuring in?"');
        this.currentOptions = [
          { ID: 'TV2', text: '"I\'m looking for someone named Madame LeSoule."' },
          { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
        ]
        break;
      case 'TV5':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Look here sir . . . ma\'am . . . thing. We don\'t take kindly to talk like that from people like you here. So state your business or you\'ll be asked to leave." He states forecefully, raising an eyebrow he very much does have.')
        this.currentOptions = [
          { ID: 'TV2', text: '"I\'m looking for someone named Madame LeSoule."' },
          { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
          { ID: 'TV6', text: '"People like me, huh?" You state as menacingly as you can.' }
        ]
        break;
      case 'TV6':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift('The man pulls a bat from beneath the bar. Several patrons, watching you all the while, rise to their feet, hands reaching for sheaths.');
        this.currentOptions = [
          { ID: 'TV7', text: 'Raise your hands as if to indicate surrender.' },
          { ID: 'TV7', text: 'Raise your hands as if to curse his mortal soul.' }
        ];
        break;
      case 'TV7':
        this.currentDialogue.unshift('"The creature is here to see me!" An unseen voice rings out sharply from the back. "And I\'d appreciate if they arrived in one piece." Everyone in the room shrinks back slightly, returning to their seats. "She\'s back through there." The bartender says, pointing down a small, dark hallway with a wooden door at the end. "Don\'t linger."');
        this.currentOptions = [{ ID: 'TV8', text: 'Turn from the man and walk toward the mysterious door.' }]
        break;
      case 'TV8':
        // reroute to next room
        break;
      case 'TV9':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"If you\'ve got coin."');
        this.backpackOpen = true;
        this.hasShopped = true;
        this.currentOptions = [
          { ID: 'TV11', text: 'Pint of Beer: Increases Charisma by 1 for 1 scene. 2 gold.', cost: 2 },
          { ID: 'TV12', text: 'Fried Potatoes: Increases Constitution by 1 for 1 scene. 2 gold.', cost: 2 },
          { ID: 'TV13', text: 'Health Potion: Restores 5 HP. 5 gold.', cost: 5 },
        ];

        if (this.PC.pcid === 1) {
          this.currentOptions.push({ ID: 'TV14', text: '"That\'ll be all, thanks."' })
        } else {
          if (!this.hasTriedCharm) {
            this.currentOptions.push({ ID: 'TV27', text: '"No free samples for a charming traveler?" You ask, batting your eyelashes. (Charisma Check)' })
            this.currentOptions.push({ ID: 'TV19', text: '"That\'ll be all, thanks."' })
          } else {
            this.currentOptions.push({ ID: 'TV19', text: '"That\'ll be all, thanks."' })
          }
        }

        break;
      case 'TV10':
        this.hasAskedAboutArea = true;
        this.addPCDialogue(event.text);
        let start = npcTag + '"Not sure what there is to say, really. It\'s a small town, full of regular folks. The type that don\'t see too many outsiders and don\'t want no trouble." He says, casting you a significant look. ';
        let end = this.hasLearnedAboutMadame ? '"Of course I\'d tell you to steer clear of the forest . . . but it seems like you won\'t get that luxury."' : '"Make sure you stay out of the forest though."'
        this.currentDialogue.unshift(start + end);
        this.currentOptions = [
          { ID: 'TV20', text: '"What\'s so dangerous about the forest?"' }
        ];
        if (this.hasLearnedAboutMadame) {
          this.currentOptions.push({ ID: 'TV21', text: '"And why won\'t I get that luxury?"' });
        }
        this.currentOptions.push({ ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' });
        break;
      case 'TV11':
        this.sharedService.buyItem(event.cost, 14) ? this.currentDialogue.unshift(npcTag + successfulPurchaseLine) : this.currentDialogue.unshift(npcTag + unsuccessfulPurchaseLine);
        break;
      case 'TV12':
        this.sharedService.buyItem(event.cost, 15) ? this.currentDialogue.unshift(npcTag + successfulPurchaseLine) : this.currentDialogue.unshift(npcTag + unsuccessfulPurchaseLine);
        break;
      case 'TV13':
        this.sharedService.buyItem(event.cost, 16) ? this.currentDialogue.unshift(npcTag + successfulPurchaseLine) : this.currentDialogue.unshift(npcTag + unsuccessfulPurchaseLine);
        break;
      case 'TV14':
        this.backpackOpen = false;
        this.hasShopped = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Understood."');
        this.currentOptions = [
          { ID: 'TV8', text: '"Thanks." You mutter sheepishly before turning for the door.' },
          { ID: 'TV8', text: 'Turn from the man wordlessly and walk toward the mysterious door.' },
        ];
        break;
      case 'TV15':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Can I help you with something?"');
        this.currentOptions = [
          { ID: 'TV17', text: '"Yes, I\'m on important business. I\'m looking for someone named Madame LeSoule."' },
          { ID: 'TV17', text: 'Place the quest flyer on the bartop. "Can you point in the right direction on this?"' },
          { ID: 'TV9', text: '"Do you have anything to sell?"' },
          { ID: 'TV10', text: '"What can you tell me about the area."' },
        ];
        break;
      case 'TV16':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Uh . . . right." He mutters dryly. "Can I help you with something?"');
        this.currentOptions = [
          { ID: 'TV17', text: '"Yes, I\'m on important business. I\'m looking for someone named Madame LeSoule."' },
          { ID: 'TV17', text: 'Place the quest flyer on the bartop. "Can you point in the right direction on this?"' },
          { ID: 'TV9', text: '"Do you have anything to sell?"' },
          { ID: 'TV10', text: '"What can you tell me about the area."' },
        ];
        break;
      case 'TV17':
        this.hasLearnedAboutMadame = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Oh . . . I see." He eyes you up and down, clearly trying to take the measure of you, but giving nothing of his assessment away. "She\'s back through there." He points down a small, dark hallway with a wooden door at the end. "Did you need anything else?"');
        this.currentOptions = [];
        if (this.hasShopped) {
          this.currentOptions.push({ ID: 'TV9', text: '"Can I see the menu again?"' });
        } else {
          this.currentOptions.push({ ID: 'TV9', text: '"Do you have anything to sell?"' });
        }
        if (!this.hasAskedAboutArea) {
          this.currentOptions.push({ ID: 'TV10', text: '"What can you tell me about the area."' });
        }
        if (!this.hasAskedAboutMadame) {
          this.currentOptions.push({ ID: 'TV24', text: '"And what can you tell me about the Madame?"' });
        }
        this.currentOptions.push({ ID: 'TV8', text: '"No, that\'ll be all." You say as you turn for the door.' });
        break;
      case 'TV18':
        this.commentedOnTaters = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"I suppose they do," he states dryly, not sure what to make of your enthusiasm. "Why don\'t you take a look at the menu?"');
        this.backpackOpen = true;
        this.hasShopped = true;
        this.currentOptions = [
          { ID: 'TV11', text: 'Pint of Beer: Increases Charisma by 1 for 1 scene. 2 gold.', cost: 2 },
          { ID: 'TV12', text: 'Fried Potatoes: Increases Constitution by 1 for 1 scene. 2 gold.', cost: 2 },
          { ID: 'TV13', text: 'Health Potion: Restores 5 HP. 5 gold.', cost: 5 },
          { ID: 'TV27', text: '"No free samples for a charming traveler?" You ask, batting your eyelashes. (Charisma Check)' },
          { ID: 'TV19', text: '"That\'ll be all, thanks."' }
        ];
        break;
      case 'TV19':
        this.backpackOpen = false;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Understood. Anything else I can do for you?"');
        this.currentOptions = [];
        if (!this.hasLearnedAboutMadame) {
          this.currentOptions.push({ ID: 'TV17', text: '"Yes, I\'m on important business. I\'m looking for someone named Madame LeSoule."' });
          this.currentOptions.push({ ID: 'TV17', text: 'Place the quest flyer on the bartop. "Can you point in the right direction on this?"' });
        }
        if (!this.hasAskedAboutArea) {
          this.currentOptions.push({ ID: 'TV10', text: '"What can you tell me about the area."' });
        }
        if (this.hasShopped) {
          this.currentOptions.push({ ID: 'TV9', text: "'Can I see the menu again?'" });
        } else {
          this.currentOptions.push({ ID: 'TV9', text: '"Do you have anything to sell?"' });
        }
        this.currentOptions.push({ ID: 'TV8', text: '"No, that\'ll be all." You say as you turn for the door.' });
        break;
      case 'TV20':
        //what's so dangerous about the forest
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"The forest belongs to the fae." He says sternly. "We don\'t enter the forest. We hope they don\'t leave it."');
        this.currentOptions = [
          { ID: 'TV22', text: '"What can you tell me about the fae?"' },
          { ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' }
        ]
        break;
      case 'TV21':
        //why won't i get that luxury?
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Beacuse if you\'re working with the Madame, you\'re dealing with the fae."');
        this.currentOptions = [
          { ID: 'TV23', text: '"Do you think I have reason to be concerned?"' },
          { ID: 'TV24', text: '"And what can you tell me about the Madame?"' },
          { ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' }
        ]
        break;
      case 'TV22':
        //what can you tell me about the fae
        this.hasAskedAboutFae = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"They\'re foul, wretched creatures. Shapeshifters, liars, tricksters. Honest folk don\'t deal with the fae. Ever."');
        this.currentOptions = [
          { ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' }
        ]
        break;
      case 'TV23':
        this.hasAskedAboutConcern = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"Yes."');
        this.currentOptions = [
          { ID: 'TV25', text: '"Care to elaborate on that?"' },
        ];
        if (!this.hasAskedAboutFae) {
          this.currentOptions.push({ ID: 'TV22', text: '"What can you tell me about the fae?"' });
        }
        if (!this.hasAskedAboutMadame) {
          this.currentOptions.push({ ID: 'TV24', text: '"And what can you tell me about the Madame?"' });
        }
        this.currentOptions.push({ ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' });
        break;
      case 'TV24':
        this.hasAskedAboutMadame = true;
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"She\'s . . . a bit reclusive. Works out of the back room here. Deals in things that are beyond my understanding. Some folks say she\'s protecting the town from the fae. Others say she\'s dangerous."');
        this.currentOptions = [
          { ID: 'TV26', text: '"And what do you think of her?"' }
        ];
        if (!this.hasAskedAboutConcern) {
          this.currentOptions.push({ ID: 'TV23', text: '"Do you think I have reason to be concerned?"' });
        }
        if (!this.hasAskedAboutFae) {
          this.currentOptions.push({ ID: 'TV22', text: '"What can you tell me about the fae?"' });
        }
        this.currentOptions.push({ ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' });
        break;
      case 'TV25':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"No."');
        this.currentOptions = [];
        if (!this.hasAskedAboutConcern) {
          this.currentOptions.push({ ID: 'TV23', text: '"Do you think I have reason to be concerned?"' });
        }
        if (!this.hasAskedAboutMadame) {
          this.currentOptions.push({ ID: 'TV24', text: '"And what can you tell me about the Madame?"' });
        }
        if (!this.hasAskedAboutFae) {
          this.currentOptions.push({ ID: 'TV22', text: '"What can you tell me about the fae?"' });
        }
        this.currentOptions.push({ ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' });
        break;
      case 'TV26':
        this.addPCDialogue(event.text);
        this.currentDialogue.unshift(npcTag + '"She pays her rent on time. She keeps to herself. She\'s an intimidating woman who doesn\'t smile much and is scarier when she does. A lot of folks don\'t like that. As far as I\'m concerned she\'s fine."');
        this.currentOptions = [];
        if (!this.hasAskedAboutConcern) {
          this.currentOptions.push({ ID: 'TV23', text: '"Do you think I have reason to be concerned?"' });
        }
        if (!this.hasAskedAboutFae) {
          this.currentOptions.push({ ID: 'TV22', text: '"What can you tell me about the fae?"' });
        }
        this.currentOptions.push({ ID: 'TV19', text: '"I see. Well that\'s all I need to know about that."' });
        break;
      case 'TV27':
        this.hasTriedCharm = true;
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 15, 'none')) {
          this.commentedOnTaters ? this.sharedService.buyItem(0, 15) : this.sharedService.buyItem(0, 14);;

          this.currentDialogue.unshift('(Success!) ' + npcTag + '"Well, alright. Since it\'s your first time here and all. Here\'s' + (this.commentedOnTaters ? ' some potatoes ' : ' a pint ') + 'on the house."');
          this.currentOptions = [
            { ID: 'TV11', text: 'Pint of Beer: Increases Charisma by 1 for 1 scene. 2 gold.', cost: 2 },
            { ID: 'TV12', text: 'Fried Potatoes: Increases Constitution by 1 for 1 scene. 2 gold.', cost: 2 },
            { ID: 'TV13', text: 'Health Potion: Restores 5 HP. 5 gold.', cost: 5 },
            { ID: 'TV19', text: '"That\'ll be all, thanks."' }
          ];
        } else {
          this.currentDialogue.unshift('(Failure!) ' + npcTag + '"No." He looks at you with what may be disgust.');
          this.currentOptions = [
            { ID: 'TV11', text: 'Pint of Beer: Increases Charisma by 1 for 1 scene. 2 gold.', cost: 2 },
            { ID: 'TV12', text: 'Fried Potatoes: Increases Constitution by 1 for 1 scene. 2 gold.', cost: 2 },
            { ID: 'TV13', text: 'Health Potion: Restores 5 HP. 5 gold.', cost: 5 },
            { ID: 'TV19', text: '"That\'ll be all, thanks."' }
          ];
        }
        break;
      default:
        break;
    }
  }

  addPCDialogue(text: string) {
    this.currentDialogue.unshift(this.PC.name + ': ' + text);
  }





}
