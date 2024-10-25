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
  public idSaved = 0;

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
        this.options = [
          { id: 9, text: '"Well that\'s very generous of you. I\'ve been told to seek a temple near the center of the forest. Do you know of it?"' },
          { id: 10, text: '"I don\'t know exactly where I\'m going, but I\'m sure I\'ll know it when I see it."' }
        ];
        if (this.knowsShesFae) {
          this.options.push({ id: 11, text: 'It might be best not to let her know where I\m going. "I\'m . . . looking for someone. A human that might have gotten lost in the woods." (Charisma Deception Check)' })
        }
        break;
      case 4:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Well aren\'t I lucky you\'ve passed through here?" She says, smiling. "Why don\'t you rest a while? I bet you\'ve been travelling for hours, days even."');
        this.options = [
          { id: 7, text: 'Stride up to her as cool as you can. Sit down right next to her, no space in between you.' },
          { id: 8, text: 'Walk up to her, focusing mostly on not tripping. Sit next to her, but leave a little space.' }
        ];
        if (this.knowsShesFae) {
          this.options.push({ id: 12, text: '"Oh I\'d better not. It\'s best to keep moving."' })
        }
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
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
        if (event.id === 14 || event.id === 15 || event.id === 16 || event.id === 17) {
          this.addPCDialogue(event.text);
        }
        this.isSatClose = (event.id === 7 || event.id === 14 || event.id === 16 || event.id === 18);
        let line = event.id === 7 || event.id === 14 || event.id === 16 || event.id === 18 ? 'She links her arm in yours as she speaks.' : 'She reaches a hand out and rests it on your knee.';
        let line2 = '';

        if (event.id === 7 || event.id === 8) {
          line2 = '"Now tell me to what I owe the pleasure of this chance encounter?" ';
          this.options = [

          ]
        } else if (event.id === 14 || event.id === 15) {
          line2 = '"Now tell me about this friend of yours." ';
          this.options = [

          ]
        } else if (event.id === 16 || event.id === 17) {
          line2 = '"Now why are you trying to get this temple, sweetie?" ';
          this.options = [
            // { id: ??, text: 'She seemed to have an interesting reaction to you mentioning the temple. Why is that? (Wisdom Insight Check)' }
          ]
        } else {
          line2 = '"Now why don\'t you tell me about this quest of yours?" '
          this.options = [

          ]
        }
        this.npcDialogue(line2 + line)
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh my." She raises a hand to her mouth. "Well of course I know it, but it\'s so very far. Come, rest a while and I\'ll tell you all about it." She pats the rock next to her.');
        this.options = [
          { id: 16, text: 'Oh . . . I suppose in this situation that would be very helpful. Sit down right next to her, no space in between you.' },
          { id: 17, text: 'I certainly can\'t think of a reason I\'d say no to that. Sit next to her, but leave a little space.' }
        ];
        if (this.knowsShesFae) {
          this.options.push({ id: 13, text: '"That sounds great. Maybe I could tell you about it from here?" You don\'t approach the rock.' });
        }
        break;
      case 10:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh, a wanderer following their heart. How romantic" She purrs. "Why don\'t you take a moment to relax? You look ever so tired, and I\'d love to hear about this journey of yours." She pats the rock next to her.');
        this.options = [
          { id: 18, text: 'Stride up to her as cool as you can. Sit down right next to her, no space in between you.' },
          { id: 19, text: 'Walk up to her, focusing mostly on not tripping. Sit next to her, but leave a little space.' }
        ];
        if (this.knowsShesFae) {
          this.options.push({ id: 20, text: '"Oh I\'d better not. Can\'t stay long. Should keep moving."' },)
        }
        break;
      case 11:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 13, 'none')) {
          this.npcDialogue('(Success!) "Oh my. Why isn\'t that tragic? Come, tell me about this friend of yours. Perhaps I\'ve seen them." She says, patting the rock beside her.')
          this.options = [
            { id: 14, text: 'Stride up to her as cool as you can. Sit down right next to her, no space in between you.' },
            { id: 15, text: 'Walk up to her, focusing mostly on not tripping. Sit next to her, but leave a little space.' }
          ];
          if (this.knowsShesFae) {
            this.options.push({ id: 22, text: '"That sounds great. Maybe I could tell you about them from here?" You don\'t approach the rock.' }, { id: 21, text: '"Oh I\'d better not. Can\'t stay long. Should keep searching."' })
          }
        } else {
          this.npcDialogue('(Failure!) "A human lost in the woods, you say?" She raises one freshly plucked eyebrow at you. "You know what?" her eyes light up as an idea occurs to her. "I saw a human pass through just recently, more than one, actually. Come, tell me about this friend of yours, and I\'ll tell you if I\'ve seen them." She says, patting the rock beside her.');
          this.options = [
            { id: 14, text: 'Oh . . . I suppose in this situation that would be very helpful. Sit down right next to her, no space in between you.' },
            { id: 15, text: 'I certainly can\'t think of a reason I\'d say no to that. Sit next to her, but leave a little space.' }
          ];
          if (this.knowsShesFae) {
            this.options.push({ id: 23, text: '"That sounds great. Maybe I could tell you about them from here?" You don\'t approach the rock.' })
          }
        }
        break;
      case 12:
      //passing through won't sit
      case 20:
      //on a quest, know it when i see it won't sit
      case 21:
        //looking for human check passed should keep moving won't sit
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh surely you can spare but a moment, can\'t you? You look so weary."');
        let id = event.id === 12 ? 7 : event.id === 20 ? 18 : 14;
        this.idSaved = id;
        this.options = [
          { id: id, text: 'You suddenly, as if by magic, feel extremely tired. "I suppose you\'re right. I could use a quick break."' },
          { id: 24, text: 'Attempt to shake off this sudden sleepiness. Don\'t sit on the rock. (Constitution Saving Throw)' }
        ]
        break;
      case 13:
      //tell me about temple won't sit
      case 22:
      //tell me about lost humans check passed won't sit
      case 23:
        //tell me about lost humans check failed won't sit
        break;
      case 24:
        if (this.sharedService.skillCheck('constitution', 10, 'none')) {

        } else {
          this.dialogue.unshift('(Failure!) The sense of tiredness if overwhelming. The rock looks like the most comfortable place in the world');
          this.options = [{id:this.idSaved, text: 'Walk toward the rock, sit down next to the woman.'}]
        }
        break;
    }
  }


}
