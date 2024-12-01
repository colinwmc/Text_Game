import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-hungry-vampire',
  templateUrl: './hungry-vampire.component.html',
  styleUrls: ['./hungry-vampire.component.css']
})
export class HungryVampireComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Quiet Lady: ';
  public hasChecked = false;
  public badSense = false;

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
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. As you progress, the trees grow denser and taller. And as the light of the moon is incresingly blocked out by the canopy, the woods become darker and more ominous."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  npcDialogue(text: string) {
    this.dialogue.unshift(this.npcTag + text);
  }

  npcDies() {
    this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire_dead.jpg"
  }

  optionSelection(event: any) {

    switch (event.id) {
      case 0:
        this.narration = 'Your journey passes peacefully for a time, until you see something in the middle distance.';
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.narration = 'A lone figure stands in the middle of the path. As you move closer, you see what appears to be a young woman in a red cloak. She lacks any of the vibrant pressence of your last encounter. Rather, she appears cold and afraid, paper thin and sickly pale.';
        this.options = [{ id: 2, text: 'Continue >' }];
        break;
      case 2:
        this.narration = 'As you approach, she looks up at you, eyes filled with fear, desperation, and tears. Her lip quivers as she begins to speak with an impossibly small voice . . .';
        this.options = [{ id: 3, text: 'Continue >' }];
        break;
      case 3:
        this.narration = '';
        this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire.png";
        this.npcDialogue('"H-hi . . ."');
        this.options = [
          { id: 5, text: '"Hello there ma\'am. Are you ok?"' },
          { id: 5, text: '"What do you want?"' }
        ];
        break;
      case 4:
        this.hasChecked = true;
        this.options.splice(this.options.length - 1);
        if (this.sharedService.skillCheck('wisdom', 10, 'none')) {
          this.dialogue.unshift('(Success!) You look the woman over. She has 5 fingers on each hand, standard porportions, and no strange abnormalities. You have no sense that this woman is a fae in disguise, but perhaps you still sense some danger in her sad, ruby eyes.');
          this.badSense = true;
        } else {
          this.dialogue.unshift('(Success!) You look the woman over. She has 5 fingers on each hand, standard porportions, and no strange abnormalities. You have no sense that this woman is a fae in disguise.');
        }
        break;
      case 5:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I\'m lost. It\'s so very cold and dark in these woods." She pulls her cloak tightly around herself as she shivers.')
        this.options = [
          { id: 6, text: '"You poor thing. What\'s your name?"' },
          { id: 7, text: '"I see . . . and what were you doing out here all alone in the woods at night then?"' }
        ];
        break;
      case 6:
        this.addPCDialogue(event.text);
        this.npcTag = 'Maribelle Lee: ';
        this.npcDialogue('"My name is Maribelle. Maribelle Lee." She says, meekly. "No one has asked me that in a long time . . ."');
        this.options = [
          { id: 7, text: '"I see . . . and what were you doing out here all alone in the woods at night then?"' },
          { id: 7, text: '"Oh that just breaks my heart, Maribelle. Please, is there anything I can do for you?"' },
          // { id: 8, text: 'No one has asked her that in a long time? What could she mean by that? (Wisdom Insight Check)' }
        ];
        break;
      case 7:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I came looking for something to eat," she looks down at her feet sheepishly as she speaks. "I\'m so hungry . . . I fear I may starve."');
        this.options = [];
        if (this.PC.items.find((item: { itemID: number; }) => item.itemID === 6)) {
          this.options.push({ id: 9, text: '"I have this apple if you want it." You take the golden delicious apple from your bag and offer it to her.' })
        } if (this.PC.items.find((item: { itemID: number; }) => item.itemID === 3)) {
          this.options.push({ id: 9, text: '"I have some mushrooms if you want them." You take the wild mushrooms from your bag and offer them to her.' })
        } if (this.PC.items.find((item: { itemID: number; }) => item.itemID === 4)) {
          this.options.push({ id: 9, text: '"I have some berries if you want them." You take the wildberries from your bag and offer them to her.' })
        } if (this.PC.items.find((item: { itemID: number; }) => item.itemID === 15)) {
          this.options.push({ id: 9, text: '"I have some potatoes if you want them." You take the fried potatoes from your bag and offer them to her.' })
        }
        this.options.push({ id: 10, text: '"Sorry, I uhh . . . don\'t have any food."' }, { id: 11, text: 'Looking for food? In the woods? Alone? At night? Doesn\'t that seem a bit odd? (Wisdom Insight Check)' });
        break;
      case 8:
        if (this.sharedService.skillCheck('wisdom', 15, 'none')) {
          this.dialogue.unshift('(Success!) Though she looks young at first sight, something about this woman seems older than you can imagine')
        } else {
          this.dialogue.unshift('(Failure!) She seems sad, I guess?')
        }
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh, no . . . I can\'t eat that," she mutters apologetically.');
        this.options = [{ id: 12, text: '"Ok . . . and what could you eat?"' }];
        break;
      case 10:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh . . . well . . . you might have something you can give me . . ."');
        this.options = [{ id: 12, text: '"You think so? And what might that be?"' }];
        break;
      case 11:
        this.options.splice(this.options.length - 1);
        if (this.sharedService.skillCheck('wisdom', 10, 'none')) {
          this.dialogue.unshift('(Success!) She has no hunting equiptment, no basket for gathering. And no one would likely attempt these things in the dark anyways. Something feels off about this.');
          this.options.push({ id: 12, text: '"I see . . . and what exactly might you be looking for out here in the woods?"' })
        } else {
          this.dialogue.unshift('(Failure!) Seems fine, I guess?');
        }
        break;
      case 12:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Do you have any . . . b-blood?"');
        this.options = [
          { id: 13, text: '"Do I have any WHAT?!?!"' },
          { id: 13, text: '"I\'m sorry, you want what now?"' }
        ];
        if (this.PC.items.find((item: { itemID: number; }) => item.itemID === 18)) {
          this.options.unshift({ id: 14, text: '"Actually yeah. Here, catch." You throw her the vial of fae blood you recently collected.' })
        }
        if (this.PC.pcid === 1) {
          this.options.push({ id: 16, text: '"Uhh, no sorry, I don\'t" You say holding up your dry, boney hands.' })
        } else {
          this.options.push({ id: 15, text: '"Uhhh . . . nope. Sorry, don\'t have any of that." (Charisma Deception Check)' })
        }
        break;
      case 13:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Blood. I just need a little. And you have so much."');
        this.options = [
          { id: 17, text: '"Ok, but you get how I like, need my blood?"' },
          { id: 18, text: '"I mean  . . . maybe I could spare a little."' }
        ];
        break;
      case 14:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh wow, really?" She catches the vial and looks at it with wild hunger in her eyes. "Oh . . ." she says, her facing dropping as she looks at it. "It\'s fae blood . . ."');
        this.options = [
          { id: 19, text: '"Yes. Is that a problem?"' },
          { id: 19, text: '"Oh I\'m sorry. Is that not good enough for you?"' }
        ];
        break;
      case 15:
        this.sharedService.skillCheck('charisma', 100, 'none');
        this.addPCDialogue(event.text);
        this.npcDialogue('(Failure!) "Sure you do. I can . . . smell it." She mutters, licking her lips. "I just need a little. And you have so much."');
        this.options = [
          { id: 17, text: '"Ok, but you get how I like, need my blood?"' },
          { id: 18, text: '"I mean  . . . maybe I could spare a little."' }
        ];
        break;
      case 16:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh . . . right. I suppose you wouldn\'t, would you." She mutter dejectedly. "But what about that? Are you going to eat that?" She says pointing at the raccoon in your arms.');
        this.options = [
          { id: 20, text: '"EXCUSE YOU THAT\'S MY BEST FRIEND!!!" You shout with a degree of force and volume you rarely muster.' },
          { id: 20, text: '"Lay one finger on Priscilla and I will end you, bitch." You say sternly, pointing one long, boney finger in her direction.' }
        ]
        break;
      case 17:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Yes, but you have 1.2 gallons of blood, and I have none. Surely you wouldn\'t be so cruel as to keep it all for yourself as I wither away before you." She looks at you with big, round eyes as she speaks.');
        this.options = [
          { id: 18, text: '"I mean  . . . maybe I could spare a little."' },
          { id: 21, text: '"Oh, I assure that I could. And I must insist that you step back." ' }
        ]
        break;
      case 18:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Truly? Oh you are my savior." Her eyes swell with tears as she looks at you with undying gratitude. "I promise I\'ll only take a bit. It\'ll barely even hurt, I swear. She approaches you, her fangs lengthing in her small mouth."');
        this.options = [
          { id: 22, text: '"As long as you promise to be careful." You bare your neck to the approaching vampire.' }
        ];
        break;
      case 19:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No . . . no, it\'s ok. I was just wondering if you had anything . . . red."');
        this.options = [
          { id: 23, text: '"Oh we\'ve got a blood snob on our hands then? Well if if you don\'t like it, give it back."' }
        ];
        break;
      case 20:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I meant no disrespect, fair skelly," she shrinks back, truly surprised by your outburst. "But surely you must understand my situation. We undead must stick together, no?"');
        this.options = [
          { id: 24, text: '"You will harm this blessed creature over my dead body! Well . . . my deader body, I suppose." (Charisma Intimidation Check)' },
          { id: 25, text: '"Yes . . . I am not insensitive to your plight, friend. Perhaps if you agree to leave us in peace, I could direct you to a nearby town filled with red blooded humans."' }
        ];
        break;
      case 21:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I\'m afraid I can\'t do that," she says stepping towards you. "I\'m sorry but I need this . . ."');
        this.options = [
          { id: 18, text: '"Ok . . . ok. I suppose I could spare a little if this is how badly you need it."' },
          { id: 24, text: '"ONE MORE STEP FORWARD AND I WILL BLAST YOU OFF THE FACE OF THIS EARTH!" You shout dramitically at the small, crying woman. (Charisma Intimidation Check)' },
          { id: 25, text: '"Ok, ok, look. Agree to leave me in peace and I\'ll direct you to a nearby town. It\'s full of red blooded humans. Largely unarmed, mostly sleeping at this hour. Surely less of a risk to you than me." (Charisma Persuasion Check)' }
        ];
        break;
      case 22:
        this.sharedService.takeDamage(2);
        this.dialogue.unshift('You feel a sharp pinch as her fangs sink into your neck, but it dulls almost instantly as you feel a gentle chill emanate from the puncture sight. You can feel the blood drain from your neck, but it doesn\'t hurt. It feels strangely peaceful.');
        this.options = [
          { id: 26, text: '"Ok, that\'s enough."' },
          { id: 27, text: 'Let her keep going. She clearly needs it and it actually feels . . . kind of nice.' }
        ];
        break;
      case 23:
        //blood snob/ don't want it
        break;
      case 24:
        //threaten her
        break;
      case 25:
        //tell her about the town
        break;
      case 26:
        this.sharedService.takeDamage(3);
        this.addPCDialogue(event.text);
        this.dialogue.unshift('You hear her mumble unintelligibly into your neck, and continues to drink with growing gusto.');
        this.options = [
          {id: 28, text: '"I SAID THAT\'S ENOUGH!" (Charisma Intimidation Check)'},
          {id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)'}
        ];
        if(this.npcTag === 'Maribelle Lee: '){
          this.options.unshift({id: 30, text: '"Maribelle, sweetie, I need you to stop now." You say gently, yet firmly. (Charisma Persuasion Check)'})
        }
        break;

    }
    if (event.id >= 3 && !this.hasChecked) {
      this.options.push({ id: 4, text: 'Look her over, head to toe. See if anything seems off. (Wisdom Perception Check)' });
    }
  }

}
