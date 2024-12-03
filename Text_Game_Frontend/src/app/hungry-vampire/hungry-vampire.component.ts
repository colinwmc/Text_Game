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
  public gaveFaeBlood = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.sharedService.deboostStats();
      this.resetPC = JSON.parse(JSON.stringify(this.PC));

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
        let blood: item = {
          itemID: 18,
          itemDescription: 'A small vial of sparkly, fae blood.',
          itemName: 'Vial of Fae Blood',
          itemQuantity: 1,
          imageID: ''
        }

        this.PC.items.push(blood);
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
    this.npcTag = 'Quiet Lady: ';
    this.hasChecked = false;
    this.badSense = false;
    this.gaveFaeBlood = false;
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
          this.options.unshift({ id: 14, text: '"Actually yeah. Here, catch." You throw her the vial of fae blood you recently collected.' });
          this.gaveFaeBlood = true;
        }
        if (this.PC.pcid === 1) {
          this.options.push({ id: 16, text: '"Uhh, no sorry, I don\'t," You say holding up your dry, boney hands.' })
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
        if (this.PC.pcid === 1) {
          this.options = [{ id: 16, text: '"Uhh, no sorry, I don\'t," You say holding up your dry, boney hands.' }]
        }
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
        this.npcDialogue('"Oh . . . right. I suppose you wouldn\'t, would you." She mutters dejectedly. "But what about that? Are you going to eat that?" She says pointing at the raccoon in your arms.');
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
          { id: 21, text: '"Oh, I assure that I could. And I must insist that you step back."' }
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
        this.addPCDialogue(event.text);
        this.npcDialogue('"NO! No, I want it," she yelps, uncharacteristically sharply, holding the vial tight to her chest. "But maybe you could give me something more?" She takes a slow, tentative step toward you.');
        this.options = [
          { id: 21, text: '"Oh, I assure that I couldn\'t. And I must insist that you step back."' },
          { id: 30, text: '"You got blood already. Now be appreciative of that and move on, or we\'re going to have a problem." (Charisma Persuasion Check)' }
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 16, text: '"Uhh, no sorry, I don\'t have anything else," You say holding up your dry, boney hands.' })
        } else {
          this.options.push({ id: 18, text: '"I mean  . . . maybe I could spare a little."' })
        }
        break;
      case 24:
      case 30:
        if (this.sharedService.skillCheck('charisma', 15, event.id === 30 ? 'advantage' : 'none')) {
          if (event.id === 30) {
            this.npcDialogue('(Success!) "Yes . . ." she mutters dejectedly. "Yes, I suppose you\'re right. Thank you for your generosity fair traveller. I shall leave thee in peace." She begins to trudge off sullenly into the night.');
          } else {
            this.dialogue.unshift('(Success!) Her eyes widen dramatically. After a moments deliberation, she scurries off into the woods with surprising speed, hissing slightly as she runs.');
          }
          let name = this.npcTag === 'Maribelle Lee: ' ? 'Maribelle' : 'ma\'am';
          this.options = [
            { id: 31, text: '"Glad we could come to an understanding "' + name + '." You say as you make your own way forward.' },
            { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, keeping an eye on the woman as you proceed.' },
            { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
          ]
        } else {
          if (this.PC.pcid === 1) {
            this.npcDialogue('(Failure!) "I suppose over your deader body it is," she whispers as she lunges at you with super human speed. You feel her sharp teeth and claws tear at your bones wildly.');
          } else {
            this.npcDialogue('(Failure!) She stands stock skill for an instant, wheels turning in her head. "Sorry . . ." she whispers as she lunges at you with super human speed. You feel the sharp puncture of her fangs latching onto your neck, and the warm splash of blood as it splatters across you.');
          }
          this.sharedService.takeDamage(5);
          this.options = [
            { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
            { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
          ];
          //attack options here

        }
        break;
      case 25:
        if (this.PC.pcid === 1 || this.sharedService.skillCheck('charisma', 10, this.gaveFaeBlood ? 'advantage' : 'none')) {
          if (this.PC.pcid === 1) {
            this.sharedService.skillCheck('charisma', 12, 'none')
          }
          this.npcDialogue('(Success!) "Red blooded humans you say?" she inquires, licking her lips. "Tell me the way and I will thank you kindly and take my leave."');
          this.options = [
            { id: 33, text: 'Tell her the way back to the Half Light Inn.' },
            { id: 34, text: 'Point her in the wrong direction, weaving a tale of an imaginary town in a clearing toward the center of the forest. (Charisma Deception Check)' }
          ];
        } else {
          this.npcDialogue('(Failure!) "I\'m sure I\'ll have plenty of time and energy to retrace your steps, once I feed from you." She lunges at you with super human speed. You feel the sharp puncture of her fangs latching onto your neck, and the warm splash of blood as it splatters across you.');
          this.sharedService.takeDamage(5);
          this.options = [
            { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
            { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
          ];
          //attack options here
        }
        break;
      case 26:
        this.sharedService.takeDamage(3);
        this.addPCDialogue(event.text);
        this.dialogue.unshift('You hear her mumble unintelligibly into your neck, and continues to drink with growing gusto.');
        this.options = [
          { id: 28, text: '"I SAID THAT\'S ENOUGH!" (Charisma Intimidation Check)' },
          { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
        ];
        if (this.npcTag === 'Maribelle Lee: ') {
          this.options.unshift({ id: 32, text: '"Maribelle, sweetie, I need you to stop now." You say gently, yet firmly. (Charisma Persuasion Check)' })
        }
        break;
      case 27:
        this.dialogue.unshift('You feel more and more blood draining from your body. The sense of cool serenity spreading through your veins. Your eyes start to close as you begin to relax into sleep.');
        this.sharedService.takeDamage(5);
        this.options = [
          { id: 35, text: 'Snap out of it! Shake from this malaise and shove her off of you! (Constitution Saving Throw)' },
          { id: 36, text: 'Just a little bit more. I\'m sure she\'ll stop soon. She promised, right?' }
        ]
        break;
      case 28:
      case 32:
        if (this.sharedService.skillCheck('charisma', 12, event.id === 32 ? 'advantage' : 'none')) {
          this.npcDialogue('(Success!) "Yes, of course," she mumbles. "Just needed a little bit is all. I\'ll be going then."');
          let name = this.npcTag === 'Maribelle Lee: ' ? 'Maribelle' : 'ma\'am';
          this.options = [
            { id: 31, text: '"Yeah, glad I could help "' + name + '." You say as you make your way forward.' },
            { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, keeping an eye on the woman as you proceed.' },
            { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
          ]
        } else {
          if (this.PC.pcid === 1) {
            this.dialogue.unshift('(Failure!) She hisses terrifyingly as her claws continue to rake across your body.')
          } else {
            this.dialogue.unshift('(Failure!) She hisses terrifyingly as her fangs sink deeper into your neck. You feel her hands, once delicately placed, tighten around your shoulders with an unimaginable strength.');
          }
          this.sharedService.takeDamage(5);
          //attack options here
        }
        break;
      case 29:
        if (this.sharedService.skillCheck('strength', 14, 'none')) {
          if (this.PC.pcid === 1) {
            this.dialogue.unshift('(Success!) You grab her by the shoulders and give her a sharp shove. She crumples to the ground at your feet like a rag doll. She looks up at you with fear in her eyes before bolting into the trees with superhuman speed.');
            this.options = [
              { id: 31, text: '"Sorry I couldn\'t help "' + name + '." You say as you make your way forward.' },
              { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, eyeing the treeline for any sign of her.' },
              { id: 31, text: '"Nasty little bitch . . ." You mumble, running your hands over your scratched skull. You continue wearily into the forest.' },
              { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
            ]
          } else {
            this.dialogue.unshift('(Success!) You grab her by the shoulders and give her a sharp shove. Her teeth slide smoothly out of you as she crumples to the ground at your feet like a rag doll. She looks up at you with fear in her eyes before bolting into the trees with superhuman speed.');
            this.options = [
              { id: 31, text: '"Yeah, glad I could help "' + name + '." You say as you make your way forward.' },
              { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, eyeing the treeline for any sign of her.' },
              { id: 31, text: '"Nasty little bitch . . ." You mumble, holding your hand to your neck to wipe away the blood. You continue wearily into the forest.' },
              { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
            ]
          }
        } else {
          if (this.PC.pcid === 1) {
            this.dialogue.unshift('(Failure!) She hisses terrifyingly as she continues to attack your fragile body.');
          } else {
            this.dialogue.unshift('(Failure!) Her once delicate hands on your shoulder suddenly tighten, a surge of superhuman strength coursing through her from your blood. She hisses terrifyingly as her fangs sink deeper into your neck.');
          }
          this.sharedService.takeDamage(5);
          //attack options here
        }
        break;
      case 31:
        if (this.sharedService.encounters[2] === 'DF1') {
          this.router.navigate(['/traveller']);
        } else {
          this.router.navigate(['/illusionist']);
        }
        break;
      case 33:
        this.npcDialogue('"Thanks for your help, friend," she mumbles abashedly before dissapearing into the night.');
        this.options = [
          { id: 31, text: '"Yeah, glad I could help "' + name + '." You say as you make your way forward.' },
          { id: 31, text: '"Welp . . . that\'s officially someone else\'s problem now." You trudge onward.' },
          { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
        ]
        break;
      case 34:
        if (this.sharedService.skillCheck('charisma', 13, this.npcTag === 'Maribelle Lee: ' ? 'advantage' : 'none')) {
          this.npcDialogue('(Success!) "Thanks for your help, friend," she mumbles abashedly before dissapearing into the night.');
          this.options = [
            { id: 31, text: '"Yeah, glad I could help "' + name + '." You say as you make your way forward.' },
            { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
          ]
        } else {
          if (this.PC.pcid === 1) {
            this.npcDialogue('(Failure!) She stares at you with wide eyes for a moment. " . . . liar . . ." she whispers softly as she lunges at you with super human speed. You feel her razer sharp teeth and claws tear into your bones.');
          } else {
            this.npcDialogue('(Failure!) She stares at you with wide eyes for a moment. " . . . liar . . ." she whispers softly as she lunges at you with super human speed. You feel the sharp puncture of her fangs latching onto your neck, and the warm splash of blood as it splatters across you.');
          }
          this.sharedService.takeDamage(5);
          this.options = [
            { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
            { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
          ];
          //attack options heres
        }
        break;
      case 35:
        //snap out of sleepiness
        break;
      case 36:
        //let her go more
        break;


    }
    if (event.id >= 3 && !this.hasChecked) {
      this.options.push({ id: 4, text: 'Look her over, head to toe. See if anything seems off. (Wisdom Perception Check)' });
    }
  }

}
