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
  public identifiesCourt = false;
  public callsBoxMother = false;

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
      });
      this.sharedService.identifiedEmblem = true;
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
    this.identifiesCourt = false;
    this.callsBoxMother = false;
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
          this.identifiesCourt = true;
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
          { id: 4, text: '"AHA!" You exclaim aloud. Surely your quest has reached it\'s end.' },
          { id: 4, text: '"Finally," you mutter exasperated. "Almost died for this thing like, three times."' },
          { id: 4, text: '"Well this seems easy . . ." you whisper to yourself, looking around for traps and guards. "Almost *too* easy."' }
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
        this.options = [
          { id: 6, text: '"Who are you?"' },
          { id: 7, text: '"What do you want?" You posture yourself defensively.' }
        ];
        if (this.identifiesCourt) {
          this.options.unshift({ id: 8, text: '"Are you her? Are you the Fae Queen?"' })
        }
        break;
      case 6:
        this.addPCDialogue(event.text);
        this.npcTag = 'Fae Princess: ';
        this.npcDialogue('"I do not have a name that your tongue could pronounce, but I was to be the inheritor of this court."')
        this.options = [
          { id: 9, text: '"The inheritor of this court . . . you\'re the Fae Princess?"' },
          { id: 10, text: '"What do you mean *was* to be? What happened?"' }
        ];
        if (!this.identifiesCourt) {
          this.options.unshift({ id: 10, text: '"You\'re saying this place . . . it\'s the court of the Fae Queen?"' });
        }
        break;
      case 7:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I want you to put my mother down."');
        this.callsBoxMother = true;
        this.options = [
          { id: 10, text: '"Uhhhh .... what?" You look down at the box in your hands perplexedly.' },
          { id: 10, text: '"You mother is this box???" You say pointing at it confusedly.' }
        ];
        if (this.sharedService.identifiedEmblem) {
          this.options.unshift({ id: 10, text: 'You look again at the emblem on the box and see a matching one upon the throne. "This artifact, it isn\'t a belonging of the Fae Queen, it contains her."' });
        }
        break;
      case 8:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No. I am not the queen, not yet anyways. The queen was . . . is . . . my mother."');
        this.npcTag = 'Fae Princess: ';
        this.options = [
          { id: 9, text: '"You\'re the princess of the Fae?"' },
          { id: 10, text: '"Was or is? Where is the Fae Queen?"' }
        ];
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I suppose that is what you would call me, yes."');
        this.options = [
          { id: 11, text: '"Your highness . . ." You bow respectfully.' },
          { id: 12, text: '"I suppose you\'d like me to be impressed by that, then?" You state defiently.' },
          { id: 7, text: '"And what does the Fae Princess want with me?"' }
        ];
        break;
      case 10:
        this.addPCDialogue(event.text);
        this.npcDialogue('"You have no actual idea what you\'re doing here, do you?" The fae\'s voice isn\'t sharp or condescending. Her tone is flat, but tinged with sorrow.');
        this.options = [
          {id: 13, text: '"I\'m on a quest," you say to her proudly. "I\'ve been tasked with the retrieval of this artifact, and that\'s what I intend to do."'},
          {id: 14, text: '"I know better than to listen to the fae," you state defiantly.'},
          {id: 15, text: '"Well . . . no, not really," you utter, honestly.'}
        ];
        break;
        case 11:
          this.addPCDialogue(event.text);
          this.npcDialogue('The being eyes you uncertainly, not sure what to make of this show of apparent deference. "Very well," she finally speaks, "now kindly put my mother down and be on your way."');
          this.callsBoxMother = true;
          this.options = [
            { id: 10, text: '"Uhhhh .... what?" You look down at the box in your hands perplexedly.' },
            { id: 10, text: '"You mother is this box???" You say pointing at it confusedly.' }
          ];
          if (this.sharedService.identifiedEmblem) {
            this.options.unshift({ id: 10, text: 'You look again at the emblem on the box and see a matching one upon the throne. "This artifact, it isn\'t a belonging of the Fae Queen, it contains her."' });
          }
          break;
          case 12:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I don\'t want you to do anything, other than put my mother down and leave."');
        this.callsBoxMother = true;
        this.options = [
          { id: 10, text: '"Uhhhh .... what?" You look down at the box in your hands perplexedly.' },
          { id: 10, text: '"You mother is this box???" You say pointing at it confusedly.' }
        ];
        if (this.sharedService.identifiedEmblem) {
          this.options.unshift({ id: 10, text: 'You look again at the emblem on the box and see a matching one upon the throne. "This artifact, it isn\'t a belonging of the Fae Queen, it contains her."' });
        }
        break;
        case 13:
          this.addPCDialogue(event.text);
          this.npcDialogue('"You work for the LeSoules? I suppose that\'s hardly surprising. And what did the Madame tell you about that box, I wonder."');
          this.options = [
            {id: 14, text: '"She said it was a family heirloom. That it was stolen from her and she wanted it back."'},
            {id: 15, text: '"I dunno, I wasn\'t really listening to be honest," you say with a shrug.'},
            {id: 16, text: '"Why would I tell you?"'}
          ];
          break;
          case 14:
            this.addPCDialogue(event.text);
            this.npcDialogue('"I see. Not a single word untruthful, yet not a single truth told. And what does that remind you of, traveller?"');
            this.options = [
              {id: 17, text: '"And I suppose you would tell me the truth?"'},
              {id: 18, text: '"I see. And I\'m guessing I\'m about to be bombarded with more half truths then?"'},
              {id: 19, text: '"What are you implying?" you inquire cautiously.'}
            ];
            break;
            case 15:
              this.addPCDialogue(event.text);
            this.npcDialogue('"Do you take pride in this? Being a part of something you don\'t understand? Killing and stealing"')
    }
  }

}
