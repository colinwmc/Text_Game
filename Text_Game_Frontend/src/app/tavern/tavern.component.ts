import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

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
  // public hasContinue = true;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.currentNarration = "You open the door to reveal a small, wooden room; half lit, half full. Provincial figures look up from their beer and potatoes to cast you " + (this.PC.pcid === 1 ? "fearful looks. Each averting their eyes as soon as they see you." : "suspicious looks.") + "  The bartender fixes you with an empty stare, before reluctantly waving you over."
      this.currentOptions = [{ ID: 'TV0', text: 'Continue >' }];
    } else {
      this.sharedService.getPCList().subscribe(data => {
        this.PC = data[0];
        this.PC.currentHealth = this.PC.hp;
        this.PC.hasShitPants = false;
        this.sharedService.PC = this.PC;
        this.currentNarration = "You open the door to reveal a small, wooden room; half lit, half full. Provincial figures look up from their beer and potatoes to cast you " + (this.PC.pcid === 1 ? "fearful looks. Each averting their eyes as soon as they see you." : "suspicious looks.") + "  The bartender fixes you with an empty stare, before reluctantly waving you over."
        this.currentOptions = [{ ID: 'TV0', text: 'Continue >' }];
      })
    }


  }

  optionSelection(event: any) {
    let npcTag = 'Bartender: ';
    switch (event.ID) {
      case 'TV0':
        this.currentNarration = '';
        this.portraitID = "../../assets/Final Picks/Characters/bartender.png";
        if (this.PC.pcid === 1) {
          this.currentDialogue.unshift('Bartender: "What do you need? We . . . Don\'t want any trouble."');
          this.currentOptions = [
            { ID: 'TV1', text: '"Oh dear. Why would there be any trouble?"' },
            { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
            { ID: 'TV3', text: 'You mean no harm. Try to put the man at ease by smiling in a reassuring manner. (Charisma Check)' },
          ]
        } else {
          this.currentDialogue.unshift('Bartender: "Howdy Stranger," he says, flatly. "What can I do for you?"')
          this.currentOptions = [
            { ID: 'TV1', text: 'Uh . . . Hi.' },
            { ID: 'TV2', text: 'Salutations!' },
            { ID: 'TV1', text: 'Uh . . . Hi.' },
            { ID: 'TV2', text: 'Salutations!' },
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
          ]
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
        this.currentOptions = [{ ID: 'TV8', text: 'Turn from the man and walk through the mysterious door.' }]
        break;
      case 'TV8':
        // reroute to next room
        break;
      case 'TV9':
        this.addPCDialogue(event.text);
        break;
      case 'TV10':
        this.addPCDialogue(event.text);
        break;
      default:
        break;
    }
  }

  addPCDialogue(text: string) {
    this.currentDialogue.unshift(this.PC.name + ': ' + text);
  }



}
