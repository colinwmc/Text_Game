import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-seductress-encounter',
  templateUrl: './seductress-encounter.component.html',
  styleUrls: ['./seductress-encounter.component.css']
})
export class SeductressEncounterComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Woman in White: ';
  public setting = 1;

  public hasCountedFingers = false;
  public knowsShesFae = false;
  public isSatOnRock = false;
  public isSatClose = false;

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
        this.sharedService.PC = this.PC;
        this.resetPC = JSON.parse(JSON.stringify(this.PC));
      })
    }
    this.narration = "You exit the tavern and stand at the precipice of the forest, the tree line beginning abruptly before you, an almost too clear path opened in front of you. You wonder what dangers await you, and what welcome the forest will grant you."
    this.options = [{ id: 0, text: 'Continue >' }];
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You exit the tavern and stand at the precipice of the forest, the tree line beginning abruptly before you, an almost too clear path opened in front of you. You wonder what dangers await you, and what welcome the forest will grant you."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.hasCountedFingers = false;
    this.knowsShesFae = false;
    this.isSatOnRock = false;
    this.isSatClose = false;
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
        this.narration = "It feels like you\'ve barely entered the woods when you hear a voice singing nearby. It\'s the most beautiful sound you\'ve ever heard.";
        this.options = [
          { id: 1, text: '"I simply feel compelled to see what creature is making that beauftiful music." You say, walking towards its source.' },
          { id: 1, text: '"That seems like the sort of thing that lures people to their death, better not follow it." You say, following it.' }
        ];
        break;
      case 1:
        this.narration = 'You come through the trees to find a circular clearing containing a pool of water that seems to cast a gentle light on the surrounding trees. At the water\'s edge, a woman sits on a rock, and beckons to you.';
        this.setting = 2;
        this.options = [
          { id: 2, text: 'Continue >' }
        ]
        break;
      case 2:
        this.narration = '';
        this.portraitID = "../../assets/Final Picks/Characters/seductress.jpeg";
        this.npcDialogue('"Well who do we have here?" The woman purrs in a whispered voice. The singing in your head doesn\'t stop as she begins to speak. "And what brings you across my little oasis?"');
        this.options = [
          { id: 3, text: '"I\'m on a quest. A very serious mission that will take me deep into the forest."' },
          { id: 4, text: '"Oh, you know. Just passing through."' },
          { id: 5, text: '"I\'m out looking for lovely ladies. Looks like it\'s my lucky night. Or should I say *your* lucky night." You say, winking for emphasis. (Charisma Persuasion Check)' },
          { id: 6, text: 'You eye the woman wearily. You remember the words of the fortune teller and attempt to count her fingers. (Wisdom Perception Check)' }
        ];
        break;
      case 3:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh, that sounds very serious indeed," she says, giggling. "But you\'re in luck. I know this forest like the back of my hand," she extends one hand out in front of herself and admires her finely manicured nails "And I\'m sure wherever you\'re trying to get, I can help."');
        break;
      case 5:
        this.sharedService.skillCheck('charisma', -10, 'none');
        this.npcDialogue('(Success!) "My lucky night indeed," she says, twirling a lock of her hair in her fingers. "Why don\'t you come over, take a seat?" She pats the rock just next to her.');
        this.options = [
          { id: 7, text: 'Stride up to her as cool as you can. Sit down right next to her, no space in between you.' },
          { id: 8, text: 'Walk up to her, focusing mostly on not tripping. Sit next to her, but leave a little space.' }
        ]
        break;
      case 6:
        this.hasCountedFingers = true;
        if (this.sharedService.skillCheck('wisdom', 13, 'none')) {
          this.knowsShesFae = true;
          this.dialogue.unshift('(Success!) You look at her left hand, on her hip. There\'s five fingers there, but no thumb. And the right, it looks like even more. You probably shouldn\'t trust this woman.');
          this.options.splice(this.options.length - 1);
        } else {
          this.dialogue.unshift('(Failure!) Two. I\'m looking right at them and there\'s definitely two of them. Wait . . . what was I counting?.');
          this.options.splice(this.options.length - 1);
        }
        break;
      case 7:
      case 8:
        this.isSatClose = event.id === 7;
        let line = event.id === 7 ? 'She links her arm in yours as she speaks.' : 'She reaches a hand out and rests it on your knee.';
        this.npcDialogue('"Now tell me to what I owe the pleasure of this chance encounter?" '+line)
        break;
    }
  }


}
