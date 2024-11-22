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
          this.npcDialogue('"Do you have any . . . b-blood?"')
    }
    if (event.id >= 3 && !this.hasChecked) {
      this.options.push({ id: 4, text: 'Look her over, head to toe. See if anything seems off. (Wisdom Perception Check)' });
    }
  }

}
