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
        if (this.sharedService.identifiedEmblem && this.identifiesCourt) {
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
          { id: 13, text: '"I\'m on a quest," you say to her proudly. "I\'ve been tasked with the retrieval of this artifact, and that\'s what I intend to do."' },
          { id: 14, text: '"I know better than to listen to the fae," you state defiantly.' },
          { id: 15, text: '"Well . . . no, not really," you utter, honestly.' }
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
          { id: 16, text: '"She said it was a family heirloom. That it was stolen from her and she wanted it back."' },
          { id: 17, text: '"I dunno, I wasn\'t really listening to be honest," you say with a shrug.' },
          { id: 18, text: '"It\'s a secret."' }
        ];
        break;
      case 14:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And who is it that taught you that? Perhaps the very same person who sent you here in ignorance? Would you be at all interested in hearing the other side of the story?"');
        this.options = [
          { id: 22, text: '"Might as well, I suppose."' },
          { id: 23, text: '"Not particularly, no."' }
        ]
        break;
      case 15:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Then please allow me to enlighten you on the matter."');
        this.options = [
          { id: 22, text: '"Might as well, I suppose."' },
          { id: 23, text: '"I\'m not really that interested, to be honest."' }
        ]
        break;
      case 16:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I see. Not a single word untruthful, yet not a single truth told. And what does that remind you of, traveller?"');
        this.options = [
          { id: 19, text: '"And I suppose you would tell me the truth?"' },
          { id: 20, text: '"I see. And I\'m guessing I\'m about to be bombarded with more half truths then?"' },
          { id: 21, text: '"What are you implying?" you inquire cautiously.' }
        ];
        break;
      case 17:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I see . . . and I don\'t suppose you\'d listen if I explained this situation you\'ve landed yourself in either?"');
        this.options = [
          { id: 22, text: '"Oh no, I\'m definitiely listening this time."' },
          { id: 23, text: '"Yeah . . . probably not."' }
        ];
        break;
      case 18:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Yes, I suppose everything is with her. Secrets and half truths and subtle implications. And what does that remind you of, traveller?"');
        this.options = [
          { id: 19, text: '"And I suppose you would tell me the truth?"' },
          { id: 20, text: '"I see. And I\'m guessing I\'m about to be bombarded with more half truths then?"' },
          { id: 21, text: '"What are you implying?" you inquire cautiously.' }
        ];
        break;
      case 19:
      case 20:
      case 22:
      case 23:
        let opener = ''
        if (event.id === 19) {
          opener = '"I would tell you the truth to the best of my ability."'
        } else if (event.id === 20) {
          opener = '"No. No more of that. I think it\'s only fair that you heard the whole truth."'
        } else if (event.id === 22) {
          opener = '"Then I will do my best to illuminate the truth."'
        } else {
          opener = '"Well for the good of my people, I will speak my piece, even if it falls on deaf ears, as it so often has before."'
        }
        this.addPCDialogue(event.text);
        this.npcDialogue(opener);
        this.options = [
          { id: 24, text: '"Ok, go ahead then."' },
          { id: 24, text: '"Well, I\'m listening then."' },
          { id: 24, text: '"Here we go again . . ." you roll your eyes.' }
        ];
        break;
      case 21:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I don\'t know what you mean."');
        this.options = [
          { id: 19, text: '"And I suppose you would tell me the truth?"' },
          { id: 20, text: '"I see. And I\'m guessing I\'m about to be bombarded with more half truths then?"' }
        ];
        break;
      case 24:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Long ago, this court was filled with life. Fae beings of all shapes and sizes came and went, paying fealty to their queen. Our people thrived, our kingdom spread."');
        this.options = [
          { id: 25, text: '"K."' },
          { id: 26, text: 'Listen silently.' }
        ];
        break;
      case 25:
      case 26:
        if (event.id === 25) {
          this.addPCDialogue(event.text);
        }
        this.npcDialogue('"But there were those who did not take part in our joy, or take heart in our prosperity. Rivals emerged. Plans were hatched to halt our expansion, and to hamper our community."');
        this.options = [
          { id: 27, text: '"You mean Madame LaSoule?"' },
          { id: 28, text: 'Continue in silence.' }
        ];
        break;
      case 27:
      case 28:
        let start = '"';
        if (event.id === 27) {
          this.addPCDialogue(event.text);
          start += 'Yes. Her and her people. '
        }
        this.npcTag = 'Fae Princess: ';
        this.npcDialogue(start + 'Their plan was to capture the Queen, my mother. To trap her in that box, made from the oaken wood of a soul tree, from which all the Queen\'s awe inspiring magic would be powerless to free her."');
        this.options = [
          { id: 29, text: '"Oh dear."' },
          { id: 29, text: '"Can\'t be that awe inspiring if she can\'t get out of a box."' }
        ];
        break;
      case 29:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Without the Queen, the only one with the power to bring the fae, beings chaotic and individualistic by nature, together, the kingdom crumbled. The court was abandoned and the fae scattered across the forest, absent any purpose or ambition."');
        this.options = [
          { id: 30, text: '"How tragic."' },
          { id: 30, text: '"Serves them right, honestly.' }
        ];
        break;
      case 30:
        this.addPCDialogue(event.text);
        this.npcDialogue('"We who remained loyal to the Queen searched for her for decades. At long last we have returned her to her court, but we can not free her from her prison, for we lack the key."');
        this.options = [
          { id: 31, text: '"And what is this key you speak of?"' }
        ];
        break;
      case 31:
        this.addPCDialogue(event.text);
        this.npcDialogue('"There are two required to break the magic of the box. The first is the blood of a fae. The second is the blood of a mortal."');
        this.options = [
          { id: 32, text: '"The blood of a mortal? Is that why things have been attacking me in the woods all night?"' }
        ];
        break;
      case 32:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Yes. Loyal servants of the Fae Queen, risking their lives to obtain mortal blood to free her from her cage."');
        this.options = [
          { id: 33, text: '"That rather changes things, doesn\'t it?" you say with a dry chuckle.' },
          { id: 34, text: '"You can hardly ask me to feel sympathy for creatures that tried to kill me in the dark of night, regardless of their reasoning."' }
        ];
        if (this.sharedService.hasKilledFae) {
          this.options.unshift({ id: 35, text: '"Oh, well now I feel bad about killing them . . . "' });
        }
        break;

    }
  }

}
