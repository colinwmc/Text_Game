import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-riddle-teller',
  templateUrl: './riddle-teller.component.html',
  styleUrls: ['./riddle-teller.component.css']
})
export class RiddleTellerComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Temple Guard: ';
  public hasAcknowledgedPoop = false;

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
        this.sharedService.PC = this.PC;
        this.resetPC = JSON.parse(JSON.stringify(this.PC));
      })
    }
    this.narration = "After what felt like hours of travel, and numerous daring escapes from deadly foes, you reach a clearing in the woods. A temple stands before you, the pale stone glowing in the moonlight. Surely this is the destination the Madame spoke of."
    this.options = [{ id: 0, text: 'Continue >' }];
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "After what felt like hours of travel, and numerous daring escapes from deadly foes, you reach a clearing in the woods. A temple stands before you, the pale stone glowing in the moonlight. Surely this is the destination the Madame spoke of."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.npcTag = 'Temple Guard: ';
    this.hasAcknowledgedPoop = false;
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
        this.narration = 'Though the imposing structure remains in decent shape, it also appears clearly abandoned. There are no signs of life as you walk your way through concentric rings of stones and pillars.';
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.narration = 'As make your way up the steps to the front door, suddenly, a figure appears. It drops down from above landing deftly on the arch above the entrance.';
        this.options = [{ id: 2, text: 'Continue >' }];
        break;
      case 2:
        this.narration = '';
        this.portraitID = "../../assets/Final Picks/Characters/riddle_teller.jpeg";
        let dialogue1 = '"My, my, my. What have we here? A strange little ';
        let type = this.PC.pcid === 1 ? 'skellington' : this.PC.pcid === 2 ? 'elf' : 'dwarf';
        let dialogue2 = ' so far from home. Come to me with eyes filled with dreams ';
        let dialogue3 = this.PC.hasShitPants ? 'and pants filled with poop."' : 'and a heart filled with fear."'
        this.npcDialogue(dialogue1 + type + dialogue2 + dialogue3);
        let option = this.PC.hasShitPants ? { id: 5, text: '"I hardly think that\'s necessary to bring up." You mutter, adjusting your trousers awkwardly.' } : { id: 6, text: '"There is no fear in my heart." You puff your chest out, trying to project confidence.' };
        this.options = [
          { id: 3, text: '"I am not strange. Not so strange as you at least."' },
          { id: 4, text: '"And what sort of creature are you? I\'ve never encountered a thing quite like you."' },
          option
        ];
        break;
      case 3:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No. Perhaps you\'re not so strange, but you are certainly a stranger. And what business does a stranger have showing up at my door?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 4:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Incorrect. You\'ve met several creatures such as me. But all of them were pretending to be something else at the time. I stand before you exactly as I so choose to be."');
        this.options = [
          { id: 7, text: '"You\'re a fae? Is this what fae really look like? Their true form?"' },
          { id: 8, text: '"And whay aren\'t you shapeshifted, then? You don\'t have any tricks for me?"' },
          { id: 9, text: '"Have you considered choosing to look like something else?" you state, bitchily.' }
        ]
        break;
      case 5:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And it was hardly necessary for you to show up at my doorstep smelling of excrement, yet here you are. And I\'m currently enquiring as to why."');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 6:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Incorrect. But do not take it as an insult. It is only proper that you be afraid."');
        this.options = [
          { id: 10, text: '"Fear or no, I will be entering this temple to complete my quest."' },
          { id: 12, text: '"And what should I be afraid of then? You?"' }
        ]
        break;
      case 7:
        this.addPCDialogue(event.text);
        this.npcDialogue('"This is what *this* fae looks like, though it\'s impossible to say if a fae can have a true form at all. It is, however, *I* who will be asking the questions here, and up to you to provide the answers. To begin, why are you here and what do you want?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 8:
        this.addPCDialogue(event.text);
        this.npcDialogue('"The fae shapeshift to blend in when they are outsiders in strange lands. But this is our temple, and the only outsider here is you. And why, in fact, are you here?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Never for the sake of one such as you," the creature states, firmly ennunciating each word. "Now why have you come, and what do you want?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 12:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No, no, not me. But then again perhaps yes. Tell me first, for what reason you stand before me."');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
    }
  }

}
