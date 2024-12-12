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
  public hasAcknowledgedPoop = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.sharedService.deboostStats();
      this.resetPC = JSON.parse(JSON.stringify(this.PC));

    } else {
      this.sharedService.getPCList().subscribe(data => {
        this.PC = data[2];
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
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. The woods continue to shift and change in front of you. Though the trees are all now devoid of leaves, dry and dying, and the moon shines brightly through their branches, you can\'t help but feel that it\'s darker than ever before."
    this.options = [{ id: 0, text: 'Continue >' }];
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. The woods continue to shift and change in front of you. Though the trees are all now devoid of leaves, dry and dying, and the moon shines brightly through their branches, you can\'t help but feel that it\'s darker than ever before."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.npcTag = 'Quiet Lady: ';
    this.hasChecked = false;
    this.badSense = false;
    this.gaveFaeBlood = false;
    this.hasAcknowledgedPoop = false;
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  npcDialogue(text: string) {
    this.dialogue.unshift(this.npcTag + text);
    this.sharedService.hasKilledFae = true;
  }

  npcDies() {
    this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire_dead.png"
  }

  optionSelection(event: any) {

    switch (event.id) {
      case 0:
        this.narration = 'Your journey passes peacefully for a time, until you see something in the middle distance.';
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.narration = 'A lone figure stands in the middle of the path. As you move closer, you see what appears to be a young woman in a red cloak. She lacks any of the vibrant pressence of your previous encounters. Rather, she appears cold and afraid, paper thin and sickly pale.';
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
        if (this.PC.hasShitPants && !this.hasAcknowledgedPoop) {
          this.hasAcknowledgedPoop = true;
          this.npcDialogue('"I . . . I\'m sorry, do you smell that?" She scrunches her nose up painfully as she speaks.');
          this.options = [
            { id: 46, text: '"Yeah  . . . I may have shit my pants a bit. Sorry about that," you say ashamedly.' },
            { id: 47, text: '"What? No. I don\'t smell anything. Maybe it\'s you?" (Charisma Decpetion Check)' },
            { id: 46, text: '"I POOPED MY PANTS, OK!?!? GET OVER IT!"' }
          ];
        } else {
          this.npcDialogue('"I\'m lost. It\'s so very cold and dark in these woods." She pulls her cloak tightly around herself as she shivers.')
          this.options = [
            { id: 6, text: '"You poor thing. What\'s your name?"' },
            { id: 7, text: '"I see . . . and what were you doing out here all alone in the woods at night then?"' }
          ];
        }
        break;
      case 46:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh . . . ew. Are you like, sick or something? Do you have a disease?"');
        this.options = [
          { id: 5, text: '"I\'m sorry, did you *want* something?"' },
          { id: 5, text: '"I DON\'T HAVE A DISEASE! I JUST POOPED MY PANTS A BIT! IT HAPPENS! What did you want anyways?"' }
        ];
        break;
        case 47:
          this.addPCDialogue(event.text);
          if(this.sharedService.skillCheck('charisma', 12, 'disadvantage')){
            this.npcDialogue('(Success!) Oh. I see. Maybe an animal has defecated nearby. Judging by the smell, perhaps something monstrous, like a Wendigo, or maybe a particularly sick moose.');
            this.options = [
              {id: 5, text: '"Uhhh, yeah. Probably that. Definitely. Can I help you with something?"'},
              {id: 5, text: '"It\'s not that bad! I literally don\'t even know what you\'re talking about. What did you want anways?"'}
            ]
          }
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
        this.npcDialogue('"Oh wow, really?" She catches the vial and looks at it with wild hunger in her eyes. "Oh . . ." she says, her face dropping as she looks at it. "It\'s fae blood . . ."');
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
          this.addAttackOptions(1);

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
          this.addAttackOptions(1);
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
          if (this.PC.pcid === 1) {
            this.dialogue.unshift('(Success!) She suddenly looks at you with abject fear in her eyes. Her shambles off into the woods.');
            this.options = [
              { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, keeping an eye on the woman as you proceed.' },
              { id: 31, text: '"Teach a bitch to mess with my raccoon," you mutter, getting to your feet.' }
            ]
          } else {
            this.npcDialogue('(Success!) "Yes, of course," she mumbles. "Just needed a little bit is all. I\'ll be going then."');
            let name = this.npcTag === 'Maribelle Lee: ' ? 'Maribelle' : 'ma\'am';
            this.options = [
              { id: 31, text: '"Yeah, glad I could help "' + name + '." You say as you make your way forward.' },
              { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, keeping an eye on the woman as you proceed.' },
              { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
            ]
          }
        } else {
          if (this.PC.pcid === 1) {
            this.dialogue.unshift('(Failure!) She hisses terrifyingly as her claws continue to rake across your body.')
          } else {
            this.dialogue.unshift('(Failure!) She hisses terrifyingly as her fangs sink deeper into your neck. You feel her hands, once delicately placed, tighten around your shoulders with an unimaginable strength.');
          }
          this.sharedService.takeDamage(5);
          this.options = [];
          this.addAttackOptions(2);
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
          this.options = [];
          this.addAttackOptions(2);
        }
        break;
      case 31:
        // if (this.sharedService.encounters[2] === 'DF1') {
        //   this.router.navigate(['/traveller']);
        // } else {
        //   this.router.navigate(['/illusionist']);
        // }
        this.router.navigate(['/riddle']);
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
          this.addAttackOptions(1);
        }
        break;
      case 35:
        if (this.sharedService.skillCheck('constitution', 15, 'none')) {
          this.dialogue.unshift('(Success!) You will your body to spark to life. In one smooth motion, you grab her narrow shoulders and shove her off of you. She crumples to the ground at your feet like a rag doll. She looks up at you with fear in her eyes before bolting into the trees with superhuman speed.');
          this.options = [
            { id: 31, text: '"Sorry I couldn\'t help "' + name + '." You say as you make your way forward.' },
            { id: 31, text: '"And don\'t you come back, you hear?" You state brazenly, eyeing the treeline for any sign of her.' },
            { id: 31, text: '"Nasty little bitch . . ." You mumble, running your hands over your scratched skull. You continue wearily into the forest.' },
            { id: 31, text: '"Smell ya later." You say, striding confidently forward.' }
          ]
        } else {
          this.sharedService.takeDamage(this.PC.currentHealth - 1);
          if (this.npcTag === 'Maribelle Lee: ') {
            this.dialogue.unshift('(Failure!) You can\'t break yourself from this trance. You feel the life continue to drain from your body, as dreams of bliss swim in your head. Just before it all goes dark, you feel her teeth pull out of your neck. You sway lazily on your feet, a blurred vision of the pale woman swirling in front of you.');
            this.options = [{ id: 37, text: 'Continue >' }];
          } else {
            this.dialogue.unshift('(Failure!) You can\'t break yourself from this trance. You feel the life continue to drain from your body, as dreams of bliss swim in your head.');
            this.options = [{ id: 39, text: 'Continue >' }];
          }
        }
        break;
      case 36:
        this.sharedService.takeDamage(this.PC.currentHealth - 1);
        if (this.npcTag === 'Maribelle Lee: ') {
          this.dialogue.unshift('You feel the life continue to drain from your body, as dreams of bliss swim in your head. Just before it all goes dark, you feel her teeth pull out of your neck. You sway lazily on your feet, a blurred vision of the pale woman swirling in front of you.');
          this.options = [{ id: 37, text: 'Continue >' }];
        } else {
          this.dialogue.unshift('You feel the life continue to drain from your body, as dreams of bliss swim in your head.');
          this.options = [{ id: 39, text: 'Continue >' }];
        }
        break;
      case 37:
        this.npcDialogue('"Thank you for your gift, kind soul," she says, the sickly waiver gone from her voice. "And now that my magic has returned, allow me to return the favor." She reaches one hand forward and places it gently on your forehead.');
        this.options = [{ id: 38, text: 'Continue' }];
        break;
      case 38:
        this.PC.currentHealth = this.PC.hp;
        let heal = new Audio();
        heal.src = '../assets/Sound Effects/heal.mp3';
        heal.load();
        heal.play();
        this.npcDialogue('"Goodbye, friend."');
        this.options = [
          { id: 31, text: '"Yeah, glad I could help, Maribelle." You say as you make your way forward.' },
          { id: 31, text: '"Welp, smell ya later."' }
        ]
        break;
      case 39:
        this.sharedService.takeDamage(this.PC.hp);
        break;
      case 40:
      case 43:
        let outcome1 = this.sharedService.castAttackSpell(3, 12, 'none');
        if (outcome1 === 'frog') {
          this.dialogue.unshift('(Hit!) You press your hand against her head and release a point blank magical hex. Her body is twisted and morphed into a frog!');
          this.portraitID = "../../assets/Final Picks/Characters/hex-frog.jpg";
          this.options = [
            { id: 31, text: '"Well, I hope you have a nicer time eating bugs than blood." You say, sadly marching on.' },
            { id: 31, text: '"Welp, smell ya later," you say, striding onward.' }
          ]
        } else if (outcome1 === 'puddle') {
          this.dialogue.unshift('(Hit!) You press your hand against her head and release a point blank magical hex. The woman cries out as her body is slowly, horrifically disolved into a red and white puddle.');
          this.npcDies();
          this.options = [
            { id: 31, text: '"Oh . . . oh gods. I\'m so sorry." You saying stepping over the puddle, travelling deeper into the woods.' },
            { id: 31, text: '"Rest in pepperonis, ma\'am." You solemnly step over her and continue on your way.' }
          ]
        } else if (outcome1 === 'purple') {
          this.dialogue.unshift('(Hit!) You press your hand against her head and release a point blank magical hex. You notice the woman\'s skin turn purple, but it does nothing to deter her. She continues her assault.');
          this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire_purple.png";
          if (event.id === 40) {
            this.options = [
              { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
              { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
            ];
          } else {
            this.options = [{ id: 39, text: 'AAAAAHHHHHH!!!' }]
          }
        } else {
          this.dialogue.unshift('(Miss!) The beam of light fires from your hands and shoots past her head. She continues her attack all the more ferociously.');
          if (event.id === 40) {
            this.options = [
              { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
              { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
            ];
          } else {
            this.options = [{ id: 39, text: 'AAAAAHHHHHH!!!' }]
          }
        }
        break;
      case 41:
      //stink phase 1
      case 44:
        //stink phase 2
        if (this.sharedService.castSaveSpell(6, 0, 'advantage')) {
          if (this.PC.enhancedStink) {
            this.dialogue.unshift('(Success!) A massive noise echoes throughout the forest. The woman falls backwards onto the ground. She whines pathetically as the gas fills her lungs, until she collapses into a lifeless heap.');
            this.npcDies();
            this.options = [
              { id: 31, text: '"Oh dear . . . what a way to go. . . Oh well." You say making your way further into the woods.' }
            ]
          } else {
            this.dialogue.unshift('(Success!) The foul, green cloud surrounds the woman as she begins coughing uncontrollably. Her teeth slide out of you as she crumples like a rag doll on the ground..');
            this.options = [
              { id: 31, text: '"Smell ya later!" You shout over your shoulder as you flee deeper into the woods.' }
            ]
          }
        } else {
          this.dialogue.unshift('(Failure!) The woman breaths in the foul, green gas without filnching. Her starving desperation driving her forward.');
          if (event.id === 41) {
            this.options = [
              { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
              { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
            ];
          } else {
            this.options = [{ id: 39, text: '"AAAAAAAAHHHHHHH!!!!!!!"' }];
          }
        }
        break;
      case 42:
      case 45:
        if (this.sharedService.castAttackSpell(9, 10, 'none')) {
          this.dialogue.unshift('(Hit!) Your hammer slams into her head, splitting it like a grape. Bright, crimson blood explodes outwards like a popped water balloon.');
          this.npcDies();
          this.options = [
            { id: 31, text: '"Get wrecked." You saying striding deeper into the woods.' },
            { id: 31, text: '"Sorry \'bout it bruh." You solemnly march off and continue on your way.' }
          ]
        } else {
          this.dialogue.unshift('(Miss!) You swing with all your might, but can\'t connect with your target. You feel her teeth sink deeper into you as the life continues to drain from your body.');
          if (event.id === 42) {
            this.options = [
              { id: 28, text: '"GET OFF OF ME OR I\'LL DESTORY YOU!" (Charisma Intimidation Check)' },
              { id: 29, text: 'Grab her by the shoulders and attempt to shove her off of you. (Strength Athletics Check)' }
            ];
          } else {
            this.options = [{ id: 39, text: '"AAAAAAAAHHHHHHH!!!!!!!"' }];
          }
        }
        break;
    }
    if (event.id >= 3 && !this.hasChecked) {
      this.options.push({ id: 4, text: 'Look her over, head to toe. See if anything seems off. (Wisdom Perception Check)' });
    }
  }

  addAttackOptions(phase: number) {
    if (this.PC.pcid === 1) {
      this.options.push({ id: phase === 1 ? 40 : 43, text: 'If that\'s the way she wants to handle this. Blast her with a hex! (Spell Attack: Hex)' })
    } else if (this.PC.pcid === 2) {
      this.options.push({ id: phase === 1 ? 41 : 44, text: 'Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
    } else {
      this.options.push({ id: phase === 1 ? 42 : 45, text: 'Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
    }
  }

}
