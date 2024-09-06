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
          this.currentDialogue.unshift('Barteder: "What do you need? We . . . Don\'t want any trouble."');
          this.currentOptions = [
            { ID: 'TV1', text: '"Oh dear. Why would there be any trouble?"' },
            { ID: 'TV2', text: 'Say nothing but take the quest flyer and place it gently on the bar.' },
            { ID: 'TV3', text: 'You mean no harm. Try to put the man at ease by smiling in a reassuring manner. (Charisma Check)' },
          ]
        } else {
          this.currentDialogue.unshift('Barteder: Howdy Stranger.')
          this.currentOptions = [
            { ID: 'TV1', text: 'Uh . . . Hi.' },
            { ID: 'TV2', text: 'Salutations!' },
            { ID: 'TV1', text: 'Uh . . . Hi.' },
            { ID: 'TV2', text: 'Salutations!' },
          ]
        }

        break;
      case 'TV1':
        this.currentDialogue.unshift(this.addPCDialogue(event.text));
        this.currentDialogue.unshift(npcTag+'"Well hopefully there won\'t be." He says, eyeing you suspiciously yet curiously. "Now what did you *need*?"');
        break;
      case 'TV2':
        this.currentDialogue.unshift(npcTag+'"Oh . . . I see." He eyes you uneasily. Clearly you weren\'t what he expected when the ads went up. "She\'s back through there." He points down a small, dark hallway with a wooden door at the end.')
        break;
      case 'TV3':
        if(this.sharedService.skillCheck('charisma', 15, 'none')){
          this.currentDialogue.unshift('(Success!) He chuckles uncomfortably. He\'s not sure what to make of you, but appears more confused than afraid. A mild improvement. "Can I . . . help you?"')
        } else {
          this.currentDialogue.unshift('(Failure!) His eyes widen as he takes a step back. He appears to reach for something under the bar.')
        }
        break;
      default:
        break;
    }
  }

  addPCDialogue(text:string){
    return this.PC.name + ': ' + text;
  }



}
