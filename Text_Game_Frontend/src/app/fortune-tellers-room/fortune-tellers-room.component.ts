import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-fortune-tellers-room',
  templateUrl: './fortune-tellers-room.component.html',
  styleUrls: ['./fortune-tellers-room.component.css']
})
export class FortuneTellersRoomComponent implements OnInit {
  public PC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;

  public hasAskedAboutNature = false;
  public hasAskedAboutMisplacement = false;
  public hasCheckedEmblem = false;
  public hasIdentifiedEmblem = false;
  public hasAskedABoutOpening = false;
  public hasAskedAboutForest = false;

  constructor(private sharedService: SharedService, private router: Router) { }

  ngOnInit(): void {
    if (this.sharedService.PC) {
      this.PC = this.sharedService.PC;
      this.narration = "The feeling in the air changes immeadiately as you pass through the threshold of the back room. You see a small, dark room, lit only by candles. As the door swings shut, seemingly of its own accord, gone is the chatter of guests, and with it their uninviting glares. In its place, a single figure sits at the table in front of you, affixing you with a piercing gaze."
      this.options = [{ id: 0, text: 'Continue >' }];
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
        this.narration = "The feeling in the air changes immeadiately as you pass through the threshold of the back room. You see a small, dark room, lit only by candles. As the door swings shut, seemingly of its own accord, gone is the chatter of guests, and with it their uninviting glares. In its place, a single figure sits at the table in front of you, affixing you with a piercing gaze."
        this.options = [{ id: 0, text: 'Continue >' }];
      })
    }
  }

  optionSelection(event: any) {
    let npcTag = 'Madame LeSoule: ';
    switch (event.id) {
      case 0:
        this.portraitID = "../../assets/Final Picks/Characters/fortune_teller.png";
        this.narration = '';
        this.dialogue.unshift(npcTag + '"Hello, my dear. Please, take a seat."');
        this.options = [
          { id: 1, text: '"Hello. My name is ' + this.PC.name + '. I\'m here about the artifact." You say, pulling the ad from your pocket.' },
          { id: 2, text: '"I\'m guessing you already know why I\'m here." You say, gesturing toward the cards on the table.' }
        ];
        break;
      case 1:
      case 2:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Yes, yes, of course, dear.' + (event.id === 1 ? ' I know. ' : ' ') + 'I\'ve been expecting you. Let me begin by thanking you for your assistance in this . . . delicate matter."');
        this.options = [
          { id: 3, text: '"Well, I\'m happy to help."' },
          { id: 4, text: '"I\'ll be thanking you when I get that 500 gold."' },
          { id: 5, text: '"I haven\'t actually agreed to do anything yet."' },
        ]
        break;
      case 3:
      case 4:
      case 5:
      case 11:
      case 12:
        if (event.id < 11) {
          this.addPCDialogue(event.text);
          let opening = event.id === 3 ? '"Such an altruistic soul, aren\'t you?" She says with a slight smirk. ' : event.id === 4 ? '"Yes, I\'m not surprised that caught your attention." She says, dryly. ' : '"Well you certainly didn\'t walk all this way just for a light chat, did you sweetheart?" She says, arching an eyebrow in your direction. ';
          this.dialogue.unshift(npcTag + opening + '"As you can imagine this artifact is an object of great importance to me. Proportionate to its reward. What you\'re searching for is going to look like this." She holds out a yellowed piece of parchment, on it a drawing of a small, wooden box. Its lid and front engraved with emblems. On the side, it appears sealed by a basic metal latch.');
          this.portraitID = "../../assets/Final Picks/Item and Spell Icons/artifact-sketch.png";
        }
        if (event.id === 12) {
          this.addPCDialogue(event.text);
          this.dialogue.unshift(npcTag + '"Well that\'s because my family *is* a bit odd." She states in a manner that doesn\'t invite further questions.')
        }
        this.options = [];

        if (!this.hasAskedAboutNature) {
          this.options.push({ id: 6, text: '"What is the nature of this artifact?"' });
        }
        if (!this.hasAskedAboutMisplacement) {
          this.options.push({ id: 7, text: '"And how did it end up . . . misplaced?"' });
        }
        if (!this.hasCheckedEmblem) {
          this.options.push({ id: 8, text: 'Try to identify the emblem on the box (Intelligence Arcana Check)' });
        }
        this.options.push({ id: 9, text: '"And how do I go about retrieving it?"' });
        break;
      case 6:
        this.hasAskedAboutNature = true;
        this.addPCDialogue(event.text);
        this.portraitID = "../../assets/Final Picks/Characters/fortune_teller.png";
        this.dialogue.unshift(npcTag + '"Let\'s call it a . . . family heirloom. An object of great *sentimental* value to me."');
        this.options = [];
        if (this.hasIdentifiedEmblem) {
          this.options.push({ id: 12, text: '"Seems a bit odd that your family would be passing down an artifact marked by the Fae Queen, no?"' });
        }
        if (!this.hasCheckedEmblem) {
          this.options.push({ id: 8, text: 'Try to identify the emblem on the box (Intelligence Arcana Check)' });
        }
        if (!this.hasAskedAboutNature) {
          this.options.push({ id: 6, text: '"What is the nature of this artifact?"' });
        }
        if (!this.hasAskedAboutMisplacement) {
          this.options.push({ id: 7, text: '"And how did it end up . . . misplaced?"' });
        }
        this.options.push({ id: 9, text: '"And how do I go about retrieving it?"' });
        break;
      case 7:
        this.hasAskedAboutMisplacement = true;
        this.portraitID = "../../assets/Final Picks/Characters/fortune_teller.png";
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"I have certain . . . adversaries within the woods nearby. It was stolen from me."')
        this.options = [];
        if (!this.hasCheckedEmblem) {
          this.options.push({ id: 8, text: 'Try to identify the emblem on the box (Intelligence Arcana Check)' });
        }
        if (!this.hasAskedAboutNature) {
          this.options.push({ id: 6, text: '"What is the nature of this artifact?"' });
        }
        if (!this.hasAskedAboutMisplacement) {
          this.options.push({ id: 7, text: '"And how did it end up . . . misplaced?"' });
        }
        this.options.push({ id: 9, text: '"And how do I go about retrieving it?"' });
        break;
      case 8:
        this.hasCheckedEmblem = true;
        if (this.sharedService.skillCheck('intelligence', 0, this.PC.pcid === 2 ? 'advantage' : 'none')) {
          this.dialogue.unshift('(Success!) You\'ve seen this before. Something about the court of the Fae Queen.');
          this.hasIdentifiedEmblem = true;
          this.options = [
            { id: 10, text: '"This emblem. It\'s from the court of the Fae Queen."' },
            { id: 11, text: 'Decide not to reveal your knowledge to the fortune teller.' }
          ]
        } else {
          this.dialogue.unshift('(Failure!) It doesn\'t look like anything to you.');
          this.options = [];
          if (!this.hasAskedAboutNature) {
            this.options.push({ id: 6, text: '"What is the nature of this artifact?"' });
          }
          if (!this.hasAskedAboutMisplacement) {
            this.options.push({ id: 7, text: '"And how did it end up . . . misplaced?"' });
          }
          this.options.push({ id: 9, text: '"And how do I go about retrieving it?"' });
        }
        break;
      case 9:
        this.portraitID = "../../assets/Final Picks/Characters/fortune_teller.png";
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"You will journey into the forest. You will find, near its center, a temple. You will enter it, and retrieve the box. You will return it to me and collect your reward."');
        this.options = [];
        if (!this.hasAskedABoutOpening) {
          this.options.push({ id: 13, text: '"Do I open the box?"' });
        }
        if (!this.hasAskedAboutForest) {
          this.options.push({ id: 14, text: 'What can you tell me about this forest?' });
        }
        break;
      case 10:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Very perceptive, my dear." She says smiling. "Perhaps you do have some surprises for me."')
        this.options = [];
        if (this.hasAskedAboutNature) {
          this.options.push({ id: 12, text: '"Seems a bit odd that your family would be passing down an artifact marked by the Fae Queen, no?"' });
        }
        if (!this.hasAskedAboutNature) {
          this.options.push({ id: 6, text: '"What is the nature of this artifact?"' });
        }
        if (!this.hasAskedAboutMisplacement) {
          this.options.push({ id: 7, text: '"And how did it end up . . . misplaced?"' });
        }
        this.options.push({ id: 9, text: '"And how do I go about retrieving it?"' });

        break;
      case 13:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"You cannot open the box."');
        this.options = [{ id: 15, text: '"What if I do though?"' }];
        if (!this.hasAskedAboutForest) {
          this.options.push({ id: 14, text: 'What can you tell me about this forest?' });
        } else {
          this.options.push({ id: 16, text: '"I suppose that\'s all I need to know."' })
        }
        break;
      case 14:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"I\'m sure you\'ve heard rumors about the forest being home to the fae folk. These rumors are, of course, entirely true. I don\'t know what you\'ve heard about them, but they are dangerous, and they aren\'t welcoming."');
        this.options = [{ id: 18, text: '"Dangerous how?"' },];
        break;
      case 15:
        this.addPCDialogue(event.text);
        this.options = [{ id: 17, text: '"Ok, but like, what if I do though?"' }];
        this.dialogue.unshift(npcTag + '"Perhaps you missheard me. I didn\'t say that you *may* not open the box. I said that you *can* not open the box"');
        if (!this.hasAskedAboutForest) {
          this.options.push({ id: 14, text: 'What can you tell me about this forest?' });
        } else {
          this.options.push({ id: 16, text: '"I suppose that\'s all I need to know."' })
        }
        break;
      case 16:
        break;
      case 17:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Then you\'ll have far greater concerns than me to deal with."')
        this.options = [];
        if (!this.hasAskedAboutForest) {
          this.options.push({ id: 14, text: 'What can you tell me about this forest?' });
        } else {
          this.options.push({ id: 16, text: '"I suppose that\'s all I need to know."' })
        }
        break;
      case 18:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Each in their own way. They\'re tricksters, manipulators, shapeshifters. Some just want to play pranks on you, some want to kill you. Always be mindful of what you see, and slow to trust anything, even your own senses."');
        this.options = [{ id: 19, text: '"Then how will I know if I even see one?"' }];
        break;
      case 19:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Often you won\'t, and you may never be sure, but there are things you can do that will help. Many fae, especially the weaker ones, are imperfect in their imitations. Always count their fingers and look at their eyes; and remember that if something seems too good to be true, it probably is."');
        this.options = [{ id: 20, text: '"Anything else you can tell me about the journey ahead?"' }];
        break;
      case 20:
        this.addPCDialogue(event.text);
        this.dialogue.unshift(npcTag + '"Let\'s look to the cards," she says, shuffling the deck in her hands, "See if they can reveal any of the perils you may face."');
        this.options = [{ id: 21, text: 'Continue >' }];
        break;
      case 21:
        //shuffle the cards
        break;
      default:
        break;
    }
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }
}
