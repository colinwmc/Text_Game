import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-temple',
  templateUrl: './temple.component.html',
  styleUrls: ['./temple.component.css']
})
export class TempleComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = '???: ';
  public hasAcknowledgedPoop = false;

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
        this.PC.hasShitPants = true;
        this.sharedService.PC = this.PC;
        this.resetPC = JSON.parse(JSON.stringify(this.PC));
      })
    }
    this.narration = "You walk through the entrance to the temple. The interior is as strange and lifeless as the courtyard. Not a soul stirs from within, though small motes of light swirl about the ceiling, making it look as if the night sky itself was seeping in through the large open window at the back of the room."
    this.options = [{ id: 0, text: 'Continue >' }];
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You walk through the entrance to the temple. The interior is as strange and lifeless as the courtyard. Not a soul stirs from within, though small motes of light swirl about the ceiling, making it look as if the night sky itself was seeping in through the large open window at the back of the room."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.npcTag = '???: ';
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
        this.narration = 'The room is wide and open, and your footsteps echo eerily against the stone pillars and arches that surround you. All of it is centered upon a structure that appears to be both an altar and a throne.';
        this.options = [
          { id: 1, text: 'What is this place? (Intelligence Arcana Check)' },
          { id: 2, text: 'Continue forward to the altar.' }
        ];
        break;
      case 1:
        if (this.sharedService.skillCheck('intelligence', 10, this.PC.pcid === 3 ? 'none' : 'advantage')) {
          this.narration = '(Success!) This is no mere temple, you realize. This is the throneroom of the fae queen herself, though you can\'t imagine why it\'d be so empty...';
          this.options = [{ id: 2, text: 'Continue forward to the throne.' }];
        } else {
          this.narration = '(Failure!) You wrack your brain, but can\'t come up with anything. The ways of the fae are so unusual to you, this structure could be anything.';
          this.options = [{ id: 2, text: 'Continue forward to the altar.' }];
        }
        break;
      case 2:
        this.narration = 'As you inch closer, you notice that something is sat on the ornate, stone chair. It appears to be a small wooden box.';
        this.options = [{ id: 3, text: 'Pick up the box.' }];
        break;
      case 3:
        this.portraitID = "../../assets/Final Picks/Item and Spell Icons/artifact.jpg";
        this.narration = '';
        this.dialogue.unshift('You grasp the box in your hands, turning it over this way and that as you examine it. It fits the sketch given to you by the fortune teller exactly.');
        this.options = [
          { id: 4, text: '"AHA!" You exclain aloud. Surely your quest has reaches it\'s end.' },
          { id: 4, text: '"Finally," you mutter exasperated. "Almost died for this thing like, three times."' },
          { id: 4, text: '"Well this seems easy . . ." you whisper to yourself, looking around for traps and guards. "Almost *too* easy.' }
        ]
        break;
      case 4:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Please don\'t touch that." You hear a voice state calmly, almost gently from behind you.');
        this.options = [
          { id: 5, text: 'Turn to face this mystery speaker.' }
        ];
        break;
      case 5:
        this.portraitID = "../../assets/Final Picks/Characters/fae_princess.jpg";
        this.dialogue.unshift('You see before you a peculiar figure in a stately gown. Her hands are folded neatly in front of her and butterflies float around her peacefully. The expression in her large, round eyes is difficult to read.');
        this.options = [];
        break;

    }
  }

}
