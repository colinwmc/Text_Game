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
    this.setting = 1;
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  npcDialogue(text: string) {
    this.dialogue.unshift(this.npcTag + text);
  }

  npcDies() {
    this.portraitID = "../../assets/Final Picks/Characters/seductress_dead.jpg"
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
          { id: 45, text: 'Stride up to her as cool as you can. Sit down right next to her, no space in between you.' },
          { id: 46, text: 'Walk up to her, focusing mostly on not tripping. Sit next to her, but leave a little space.' }
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
      case 45:
      case 46:
        if (event.id === 14 || event.id === 15 || event.id === 16 || event.id === 17) {
          this.addPCDialogue(event.text);
        }
        this.isSatClose = (event.id === 7 || event.id === 14 || event.id === 16 || event.id === 18 || event.id === 45);
        let line = event.id === 7 || event.id === 14 || event.id === 16 || event.id === 18 ? 'She links her arm in yours as she speaks.' : 'She reaches a hand out and rests it on your knee.';
        let line2 = '';

        if (event.id === 7 || event.id === 8 || event.id === 45 || event.id === 46) {
          line2 = '"Now tell me to what I owe the pleasure of this chance encounter?" ';
          if (event.id === 7 || event.id === 8) {
            this.options = [
              { id: 35, text: '"Oh I\'m just . . . out for a moonlit stroll."' },
              { id: 35, text: '"I\'m travelling to meet my grandmother. Over the river and through the woods and all."' },
              { id: 35, text: '"I\'m not sure that\'s any of your business, to be honest."' }
            ]
          } else {
            this.options = [
              { id: 28, text: '"Well I was just in the neighborhood when I came across this beautiful oasis, and this even more beautiful woman."' },
              { id: 28, text: '"Oh you know me. Out on the town, dishin\' out the rizz."' }
            ]
          }
        } else if (event.id === 14 || event.id === 15) {
          line2 = '"Now tell me about this friend of yours." ';
          this.options = [
            { id: 35, text: '"Oh they\'re, you know, pretty ordinary."' },
            { id: 35, text: '"They\'re . . . ummmm, tall and kind of green."' },
            { id: 38, text: '"They\'re fat and gross and ugly. You know, just like you."' }
          ]
        } else if (event.id === 16 || event.id === 17) {
          line2 = '"Now why are you trying to get this temple, sweetie?" ';
          this.options = [
            { id: 25, text: 'She seemed to have an interesting reaction to you mentioning the temple. Why is that? (Wisdom Insight Check)' },
            { id: 26, text: '"I\'m uhh . . . sightseeing." (Charisma Decpetion Check)' },
            { id: 35, text: '"Well there\s this fortune teller who\'s going to pay me big bucks to find her this fancy box there."' }
          ]
        } else {
          line2 = '"Now why don\'t you tell me about this quest of yours?" '
          this.options = [
            { id: 35, text: '"It is a quest of the utmost importance. It may even save the world, honestly."' },
            { id: 35, text: '"It\'s a journey of self discovery. A daliance with destiny. A mission from which I shall not return unchanged."' },
            { id: 35, text: '"I\'m really just trying to get paid is all."' }
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
      case 20:
      case 21:
      case 13:
      case 22:
      case 23:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh surely you can spare but a moment, can\'t you? You look so weary."');
        let id = 0;
        switch (event.id) {
          case 12:
            id = 7;
            break;
          case 20:
            id = 18;
            break;
          case 21:
            id = 14;
            break;
          case 13:
            id = 16;
            break;
          case 22:
            id = 14;
            break;
          case 23:
            id = 14;
            break;
        }
        this.idSaved = id;
        this.options = [
          { id: id, text: 'You suddenly, as if by magic, feel extremely tired. "I suppose you\'re right. I could use a quick break."' },
          { id: 24, text: 'Attempt to shake off this sudden sleepiness. Don\'t sit on the rock. (Constitution Saving Throw)' }
        ]
        break;
      case 24:
        if (this.sharedService.skillCheck('constitution', 10, 'none')) {
          this.dialogue.unshift('(Success!) You manage to pull yourself together. That sudden tiredness, it must have been magical. She\'s trying to weaken you, lure you forward into her trap!');
          this.options = [
            { id: 47, text: 'Make a run for it! Don\'t say anything, just turn and run back into the woods! (Strength Athletics Check)' }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 42, text: 'You\'re in danger! Hit that fae with a hex! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 43, text: 'Blast that fae! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 48, text: 'Throw a fire bomb. Blow her to smithereens! (Ranged Attack: Fire Bomb)' })
          }
        } else {
          this.dialogue.unshift('(Failure!) The sense of tiredness if overwhelming. The rock looks like the most comfortable place in the world');
          this.options = [{ id: this.idSaved, text: 'Walk toward the rock, sit down next to the woman.' }]
        }
        break;
      case 25:
        if (this.sharedService.skillCheck('wisdom', 12, 'none')) {
          this.dialogue.unshift('(Success!) She doesn\'t want you going to the temple. Is she protecting it? Is she . . . a FAE?!');
          this.knowsShesFae = true;
        } else {
          this.dialogue.unshift('(Failure!) You\'re sure it was nothing. She seems so nice."');
        }
        this.options.splice(0, 1);
        break;
      case 26:
        this.sharedService.skillCheck('charisma', 0, 'none');
        this.npcDialogue('(Success??) "Sightseeing, eh?" She looks at you with a mysterious look. "Well if that\'s what you\'re looking for you don\'t want the temple. It\'s old, falling apart. There\'s nothing to see there. Don\'t you see any sights here that you\'d rather take in?" She leans in towards you as she speaks.');
        this.options = [
          { id: 28, text: '"Oh I see a couple of things." You say with a wry smile' },
          { id: 29, text: '"I suppose the pool here is quite lovely."' },
          { id: 30, text: '"I\'m actually really into old and crusty."' }
        ]
        break;
      case 27:
        break;
      case 28:
      case 29:
      case 30:
      case 36:
      case 37:
        this.addPCDialogue(event.text)
        if (event.id === 28) {
          this.npcDialogue('"Kiss me." She says softly, yet firmly, slowly moving towards you.');
        } else if (event.id === 29) {
          this.npcDialogue('"Oh don\'t be coy sweetie," she says with a laugh. "Just kiss me." She says softly, yet firmly, slowly moving towards you.')
        } else if (event.id === 30) {
          this.npcDialogue('"Oh, just shut up and kiss me." She says slightly annoyed, slowly moving towards you.');
        } else if (event.id === 36) {
          this.npcDialogue('"Oh, I know, sweetie," she says, leaning in towards you, "But it simply can\'t be helped."');
        }
        else if (event.id === 37) {
          this.npcDialogue('"I just can\'t stop thinking about kissing you." She says softly, slowly moving towards you.');
        }
        this.options = [
          { id: 31, text: 'Close you eyes and lean in.' },
          { id: 32, text: 'Lean in towards her, but don\'t close your eyes.' },
        ];
        if (this.knowsShesFae) {
          this.options.push({ id: 33, text: '"I couldn\'t possibly." You say, backing away.' },
            { id: 34, text: '"Eww gross no way!"' })
        }
        break;
      case 31:
        this.dialogue.unshift('Time seems to stand still for a moment. You body tingles with anticipation. You feel her hand lightly cup your face, and you wait for the touch of her lips. When it comes, it\'s not where you expect it. You feel her lips, and teeth, envelop your entire head. You open your eyes to see the back of her throat moving towards your face.');
        this.sharedService.takeDamage(5);
        let check3 = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
        this.options = [
          { id: 52, text: 'Try to wriggle out of her mouth before she swallows you whole! ' + check3 }
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 53, text: 'She\'s eating you! Try to blast her with a hex! (Spell Attack: Hex)' })
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 54, text: 'She\'s eating you! Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
        } else {
          this.options.push({ id: 55, text: 'She\'s eating you! Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
        }
        break;
      case 32:
        this.dialogue.unshift('You see her face move towards you, soft and sweet. Her lips part. First slightly, then wider, wider, wider, her jaw unhinging until her mouth envelops your entire head.');
        this.sharedService.takeDamage(5);
        let check2 = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
        this.options = [
          { id: 52, text: 'Try to wriggle out of her mouth before she swallows you whole! ' + check2 }
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 53, text: 'She\'s eating you! Try to blast her with a hex! (Spell Attack: Hex)' })
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 54, text: 'She\'s eating you! Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
        } else {
          this.options.push({ id: 55, text: 'She\'s eating you! Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
        }
        break;
      case 33:
        this.addPCDialogue(event.text);
        let location = this.isSatClose ? 'around your arm' : 'on your leg';
        this.npcDialogue('"Oh I assure you, you could," she says as she tighens her grip ' + location + ' and continues to lean in toward your face.');
        let check = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
        this.options = [
          { id: 32, text: '"Oh, well I suppose if you insist," you mutter leaning towards her.' },
          { id: 41, text: '"NO!" You scream attempting to break free from her grasp. ' + check },
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 42, text: 'She\'s coming right at you. Blast her with a hex! (Spell Attack: Hex)' })
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 43, text: 'She\'s coming right at you. Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
        } else {
          this.options.push({ id: 44, text: 'She\'s coming right at you. Reach for your hammer and fend her off! (Melee Attack: Hammer)' })
        }
        break;

      case 35:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Oh I\'m sorry sweetie. I\'m sure that\'s very important, but I\'m so distracted thinking about something else."');
        this.options = [
          { id: 36, text: '"Well that\'s kind of rude . . . "' },
          { id: 37, text: '"What are you thinking about?"' }
        ]
        break;
      case 34:
      case 38:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Excuse me?!" Her face suddenly hardens.');
        this.options = [
          { id: 39, text: '"Haha . . . just kidding?" (Charisma Persuasion Check)' },

        ];
        event.id === 34 ? this.options.push({ id: 40, text: '"It\'s just that kissing you sounds gross and bad"' }) : this.options.push({ id: 40, text: '"Yeah, actually that\'s why I walked over. I thought you were him."' });
        break;
      case 39:
        this.addPCDialogue(event.text);
        if (this.sharedService.skillCheck('charisma', 20, 'none')) {
          this.npcDialogue('(Success!) "Oh don\'t tease me like that, sweetie. Why don\'t you just shut those quick lips of yours and kiss me?"');
          this.options = [
            { id: 31, text: 'Close you eyes and lean in.' },
            { id: 32, text: 'Lean in towards her, but don\'t close your eyes.' },
          ];
          if (this.knowsShesFae) {
            this.options.push(
              { id: 33, text: '"I couldn\'t possibly." You say, backing away.' },
              { id: 34, text: '"Eww gross no way!"' })
          }
        } else {
          let slap = new Audio();
          slap.src = "../assets/Sound Effects/slap.mp3";
          slap.load();
          slap.play();
          this.sharedService.takeDamage(5);
          this.npcDialogue('"How dare you speak to me like that, you little wretch?!" She slaps you hard across the face.')
        }
        this.options = [
          {id: 49, text: '"Sorry, not sorry."'},
          {id: 49, text: '"You\'re the one who\'s wretched, bitch!"'}
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 42, text: 'Oh no she didn\'t! Hit that fae with a hex! (Spell Attack: Hex)' });
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 43, text: 'Oh no she didn\'t! Blast that fae! (Spell Attack: Ice Blast)' });
        } else {
          this.options.push({ id: 44, text: 'Oh no she didn\'t! It\'s hammer time! (Melee Attack: Hammer)' })
        }
        break;
      case 40:
        let slap = new Audio();
        slap.src = "../assets/Sound Effects/slap.mp3";
        slap.load();
        slap.play();
        this.sharedService.takeDamage(5);
        this.npcDialogue('"How dare you speak to me like that, you little wretch?!" She slaps you hard across the face.')
        this.options = [
          {id: 49, text: '"Sorry, not sorry."'},
          {id: 49, text: '"You\'re the one who\'s wretched, bitch!"'}
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 42, text: 'Oh no she didn\'t! Hit that fae with a hex! (Spell Attack: Hex)' });
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 43, text: 'Oh no she didn\'t! Blast that fae! (Spell Attack: Ice Blast)' });
        } else {
          this.options.push({ id: 44, text: 'Oh no she didn\'t! It\'s hammer time! (Melee Attack: Hammer)' })
        }
        break;
      case 41:
        let modifier = this.PC.pcid === 3 ? 'strength' : 'dexterity';
        let bonus = this.isSatClose ? 'disadvantage' : 'none';
        if (this.sharedService.skillCheck(modifier, 15, bonus)) {
          this.dialogue.unshift('(Success!) You break free from her grip, tumbling off the rock and landing on your feet.');
          this.options = [
            { id: 47, text: 'Make a run for it! Don\'t say anything, just turn and run back into the woods! (Strength Athletics Check)' }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 42, text: 'You\'re in danger! Hit that fae with a hex! (Spell Attack: Hex)' });
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 43, text: 'Blast that fae! (Spell Attack: Ice Blast)' });
          } else {
            this.options.push({ id: 48, text: 'Throw a fire bomb. Blow her to smithereens! (Ranged Attack: Fire Bomb)' })
          }
        } else {
          this.dialogue.unshift('(Failure!) Her grip on you is iron tight, you can\'t break free. She continues leaning toward you with incresing speed. Her lips part. First slightly, then wider, wider, wider, her jaw unhinging until her mouth envelops your entire head.');
          this.sharedService.takeDamage(5);
          let check = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
          this.options = [
            { id: 52, text: 'Try to wriggle out of her mouth before she swallows you whole! ' + check }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 53, text: 'She\'s eating you! Try to blast her with a hex! (Spell Attack: Hex)' })
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 54, text: 'She\'s eating you! Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
          } else {
            this.options.push({ id: 55, text: 'She\'s eating you! Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
          }
        }

        break;
      case 42:
        let outcome = this.sharedService.castAttackSpell(3, 10, !this.isSatOnRock ? 'advantage' : !this.isSatClose ? 'none' : 'disadvantage')
        if (outcome === 'frog') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits her in the chest. Her body is twisted and morphed into a frog!.');
          this.portraitID = "../../assets/Final Picks/Characters/hex-frog.jpg";
          this.options = [
            { id: 50, text: '"Well, at least you have a nice pond to live in here." You saying striding deeper into the woods.' },
            { id: 50, text: '"Not so pretty now, are ya \'sweetie?\'" You continue on into the forest.' }
          ]
        } else if (outcome === 'puddle') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits her in the chest. The woman cries out as her body is slowly, horrifically disolved into a sparkly, indigo puddle.');
          this.npcDies();
          this.options = [
            { id: 50, text: '"Oh . . . oh gods. I\'m so sorry." You saying stepping over the puddle, travelling deeper into the woods.' },
            { id: 50, text: '"Rest in pepperonis, ma\'am." You solemnly step over her and continue on your way.' },
            { id: 51, text: 'Collect a bit of her sparkly, fae blood.' }
          ]
        } else if (outcome === 'purple') {
          this.dialogue.unshift('(Hit!) A bolt of magic flies from your fingertips and hits her in the chest. The woman\'s eyes light up in terror. Feeling strange, she looks at herself in the reflection of the water. "I\'m  . . . PURPLE?! My flawless skin is PURPLE?!?!" She turns her face to you, untamed fury in her eyes.');
          this.portraitID = "../../assets/Final Picks/Characters/seductress_purple.jpg"
          this.options = [
            { id: 49, text: '"Oh dear . . ."' }
          ];
        }
        else {
          this.dialogue.unshift('(Miss!) A bolt of magic flies from your fingertips and soars just above her shoulder. She turns her face to you, untamed fury in her eyes.');
          this.options = [
            { id: 49, text: '"Oh dear . . ."' }
          ]
        }
        break;
      case 43:
        //stinking cloud
        break;
      case 44:
        //hammer
        break;
      case 47:
        if (this.sharedService.skillCheck('strength', 12, 'none')) {
          this.dialogue.unshift('(Success!) You bolt out of there as fast as you can. You can hear the woman running after you, growling, but she seems to stop when you reach the treeline. She howls with anger as you make your escape.');
          this.options = [{ id: 50, text: 'Continue deeper into the forest.' }]
        } else {
          this.dialogue.unshift('(Failure!)')
          this.dialogue.unshift('(Failure!)  You try to run, but the woman leaps off the rock with startling speed and tackles you to the ground. Face to face with her, you see her lips part. First slightly, then wider, wider, wider, her jaw unhinging until her mouth envelops your entire head.');
          this.sharedService.takeDamage(5);
          let check = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
          this.options = [
            { id: 52, text: 'Try to wriggle out of her mouth before she swallows you whole! ' + check }
          ];
          if (this.PC.pcid === 1) {
            this.options.push({ id: 53, text: 'She\'s eating you! Try to blast her with a hex! (Spell Attack: Hex)' })
          } else if (this.PC.pcid === 2) {
            this.options.push({ id: 54, text: 'She\'s eating you! Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
          } else {
            this.options.push({ id: 55, text: 'She\'s eating you! Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
          }
        }
        break;
      case 48:
        //fire bomb
        break;
      case 49:
        this.dialogue.unshift('She lunges at you with incedible speed and ferocity. Her lips part. First slightly, then wider, wider, wider, her jaw unhinging until her mouth envelops your entire head.');
        this.sharedService.takeDamage(5);
        let check1 = this.PC.pcid === 3 ? '(Strength Saving Throw)' : '(Dexterity Saving Throw)';
        this.options = [
          { id: 52, text: 'Try to wriggle out of her mouth before she swallows you whole! ' + check1 }
        ];
        if (this.PC.pcid === 1) {
          this.options.push({ id: 53, text: 'She\'s eating you! Try to blast her with a hex! (Spell Attack: Hex)' })
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 54, text: 'She\'s eating you! Fend her off with a stinking cloud! (Spell Cast: Stinking Cloud)' })
        } else {
          this.options.push({ id: 55, text: 'She\'s eating you! Reach for your hammer try to strike her! (Melee Attack: Hammer)' })
        }
        break;
      case 50:
        if (this.sharedService.encounters[1] === 'MF1') {
          this.router.navigate(['/moth']);
        } else {
          this.router.navigate(['/vamp']);
        }
        break;
      case 51:
        let blood: item = {
          itemID: 18,
          itemDescription: 'A small vial of sparkly, fae blood.',
          itemName: 'Vial of Fae Blood',
          itemQuantity: 1,
          imageID: ''
        }

        this.PC.items.push(blood);
        this.options.splice(this.options.length - 1);
        break;
      case 52:
        let mod = this.PC.pcid === 3 ? 'strength' : 'dexterity';
        if (this.sharedService.skillCheck(mod, 15, 'none')) {
          this.dialogue.unshift('(Success!) While grabbing at each of her jaws, you place your foot against her chest and kick your way out. She falls backwards off the rock and splashes into the water below.');
          this.options = [{ id: 50, text: 'Run! Run for your life before she gets back up!' }]
        } else {
          this.dialogue.unshift('(Failure!) She holds you with superhuman strength. You feel her teeth bite into your head as it\'s wrenched from your body.');
          this.options = [{ id: 56, text: '"AAAAAAAAHHHHHHH!!!!!!!"' }];
        }
        break;
      case 53:
        //hex while in mouth
        break;
      case 54:
        //cloud while in mouth
        break;
      case 55:
        //hammer while in mouth
        break;
      case 56:
        this.sharedService.takeDamage(50);
        break;
    }
  }


}
