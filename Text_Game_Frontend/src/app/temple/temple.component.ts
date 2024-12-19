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
        this.PC = data[0];
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

  npcDies() {
    this.portraitID = "../../assets/Final Picks/Characters/fae_princess_dead.jpg";
    this.sharedService.hasKilledFae = true;
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
      case 33:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I should certainly say so, though I suppose I\'m heartened to hear a mortal such as you voice sympathy for us. Most treat us as common monsters. Cautionary tales to scare their children."');
        this.options = [
          { id: 36, text: '"And how would you be treated?"' },
          { id: 37, text: '"And you would claim that all their fears are simply imagined?"' }
        ]
        break;
      case 34:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And who would you have sympathy for? The humans who lock away our queen, destroy our society, and treat us as nothing more than common monsters?"');
        this.options = [
          { id: 38, text: '"So you would play the victim and call them monsters instead?"' },
          { id: 39, text: '"I didn\'t say that."' }
        ];
        break;
      case 35:
        this.addPCDialogue(event.text);
        this.npcDialogue('"As well you should. Immortal beings meant to be filled with life and joy forever, snuffed out so that you can make some gold. Though I suppose I\'m heartened to hear a mortal such as you voice sympathy for us. Most treat us as common monsters. Cautionary tales to scare their children."');
        this.options = [
          { id: 40, text: '"Then I suppose I\'m the monster in your version of the story?"' }
        ];
        break;
      case 36:
      case 37:
      case 38:
      case 39:
      case 40:
        this.addPCDialogue(event.text);
        let first = '';
        if (event.id === 36) {
          first = '"Like beings who have a right to their own ways, and be who they are. '
        } else if (event.id === 37) {
          first = '"People come into confict. It happens everyday. But to place all the blame on us is unfair. '
        } else if (event.id === 38) {
          first = '"Perhaps there is . . . blame to go around. But to place all the blame on us is unfair. '
        } else if (event.id === 39) {
          first = '"'
        } else {
          first = '"Your role in this tale is still yet to be detirmined. '
        }
        this.npcDialogue(first + 'You are not fae, this is true, but neither are you human. And how did the humans treat you when you arrived in their town?"');
        this.options = [
          { id: 41, text: '"Well, they didn\'t seem too welcoming to outsiders, to be honest."' },
        ];
        if (this.sharedService.successfullyCharmed) {
          this.options.unshift({ id: 43, text: '"Pretty good, to be honest, they gave me free potatoes."' })
        } else if (this.sharedService.failedToCharm) {
          this.options.unshift({ id: 44, text: '"They were kind of rude to be honest. Wouldn\'t even let me have any free potatoes."' })
        } else if (this.sharedService.smiledDisarmingly) {
          this.options.unshift({ id: 45, text: '"They were nicer than I expected, honestly. They were still kind of scared though."' })
        } else if (this.sharedService.wasConfrontatitional) {
          this.options.unshift({ id: 46, text: '"They . . . treated me like a monster . . ."' })
        } else {
          this.options.unshift({ id: 42, text: '"No strong way in particular, I guess." You say with a shrug.' })
        }
        break;
      case 41:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And isn\'t funny how many people get the title of \'outsider?\' Are these the people you will serve? Those who shun any who aren\'t just like them?"');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 42:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Then perhaps you look enough like them to avoid their disdain, but not enough to earn their respect."');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 43:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Is this the price for which you will damn my people? Potatoes?"');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 44:
        this.addPCDialogue(event.text);
        this.npcDialogue('"This does not surprise me. Their treatment of \'outsiders\' is wrought with resentment. Are these the people you will serve? Those who treat you as an outsider?"');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 45:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Then perhaps this time you were lucky, but I can see in your eyes that you\'re faced the their scorn and their fear just as we have, and yet you arrive here to do their bidding."');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 46:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I am sorry little one, but I know the feeling of their fear and scorn better than any. We are not so different, you and I, and yet you arrive here to do their bidding."');
        this.options = [
          { id: 47, text: '"And what would you have me do?"' }
        ];
        break;
      case 47:
        this.addPCDialogue(event.text);
        this.npcDialogue('"It is time for you to make your choice. You can strike me down and return to your masters with our queen. Or you can offer up your blood and bring a new golden age to our people."');
        if (this.PC.pcid !== 1) {
          this.options = [
            { id: 48, text: '"I have accepted a quest. I am bound to complete it. I will do what I must to do so."' },
            { id: 48, text: '"I know little of these lands and your history, but I will not trust the word of a fae. Of this and only this I can be sure."' },
            { id: 49, text: '"It seems a great wrong has been done to your people. I will do what I can to make it right."' },
            { id: 50, text: '"I was offered 500 gold to return this box. What could you offer me?"' }
          ];
        } else {
          this.options = [
            { id: 48, text: '"I have accepted a quest. I am bound to complete it. I will do what I must to do so."' },
            { id: 51, text: '"I am sympathetic to your people, but alas I have no mortal blood to offer you," you hang your head as you glance at your skeletal hands.' }
          ];
        }
        break;
      case 48:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Then do it. Look into my eyes and ends the hopes of my people."');
        this.options = []
        if (this.PC.pcid === 1) {
          this.options.push({ id: 52, text: 'Spell Attack: Hex' });
        } else if (this.PC.pcid === 2) {
          this.options.push({ id: 53, text: 'Spell Attack: Ice Blast' });
        } else {
          this.options.push({ id: 54, text: 'Melee Attack: Hammer' });
        }
        break;
      case 49:
        this.addPCDialogue(event.text);
        this.dialogue.unshift('The fae approaches you wordlessly. She retracts a single claw from her hand and drags it across her palm. She looks to you expectantly.');
        this.options = [{ id: 55, text: 'Offer her your palm.' }];
        break;
      case 50:
        this.addPCDialogue(event.text);
        this.npcDialogue('"If tales of our plight mean nothing to you and you only think in reward, then I assure you that the Fae Queen is a being of great power. Release her, and in turn she will grant you whatever you desire."');
        this.options = [
          { id: 48, text: '"Eh, sounds iffy. I\'ll probably just take the gold."' },
          { id: 49, text: '"Ooh, I like the sound of that. Ok, let\'s do it then."' }
        ];
        break;
      case 51:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And what about the one in your arms? Could she offer her blood?"');
        this.options = [
          { id: 56, text: '"Would that even work? The blood of a raccoon?"' }
        ];
        break;
      case 52:
        let hex = new Audio();
        hex.src = '../assets/Sound Effects/hex.mp3';
        hex.load();
        hex.play();
        this.npcDies();
        this.dialogue.unshift('You bone a boney finger at her and unleash a hex bolt. Without flincing, she is struck in the chest and begins to melt away, maintaining eye contact with you the whole time.');
        this.sharedService.ending = 1;
        this.options = [
          { id: 60, text: '"I\'m truly sorry . . . " you whisper as you exit the temple.' },
          { id: 60, text: '"Smell ya later, princess."' }
        ];
        break;
      case 53:
        let ice = new Audio();
        ice.src = '../assets/Sound Effects/ice-blast.mp3';
        ice.load();
        ice.play();
        this.npcDies();
        this.dialogue.unshift('You project a shard of ice from the tips of your fingers which impale the princess through the chest. She doesn\'t cry out. She doesn\'t flinch. She doesn\'t break eye contact with you as she collapses to the floor.');
        this.sharedService.ending = 1;
        this.options = [
          { id: 60, text: '"I\'m truly sorry . . . " you whisper as you exit the temple.' },
          { id: 60, text: '"Smell ya later, princess."' }
        ];
        break;
      case 54:
        let swing = new Audio();
        swing.src = '../assets/Sound Effects/hammer-swing.mp3';
        swing.load();
        swing.play();
        let hit = new Audio();
        hit.src = '../assets/Sound Effects/hammer-hit.mp3';
        hit.load();
        hit.play();
        this.npcDies();
        this.dialogue.unshift('You grab your hammer and swing it at her head. She doesn\'t cry out. She doesn\'t flinch. She doesn\'t break eye contact with you as she collapses to the floor.');
        this.sharedService.ending = 1;
        this.options = [
          { id: 60, text: '"I\'m truly sorry . . . " you whisper as you exit the temple.' },
          { id: 60, text: '"Smell ya later, princess."' }
        ];
        break;
      case 55:
        this.dialogue.unshift('She drags a claw across your palm, just deep enough to draw blood, which pools gently in your hand. She then places her hand on the lid of the box.');
        this.options = [
          { id: 59, text: 'Place your hand on the box.' }
        ]
        break;
      case 56:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Normally no, but she hasn\'t always been a raccoon, has she?"');
        this.options = [
          { id: 57, text: '"No . . . no she hasn\'t" you say hanging your head. "It was an accident. I couldn\'t fix it."' }
        ];
        break;
      case 57:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I am sorry, child. But will she offer her blood to fix this wrong?"');
        this.options = [
          { id: 58, text: 'You look down to see Priscilla stretching one hand forward, palm up, quiet understanding in her dark eyes. "Yes, it looks like she will."' },
          { id: 48, text: '"No. I\'m sorry, but I won\'t let you hurt her."' }
        ];
        break;
      case 58:
        this.addPCDialogue(event.text);
        this.dialogue.unshift('The fae approaches you wordlessly. She retracts a single claw from her hand and drags it across her palm. She reaches out to Priscilla and lightly scratches the palm of her hand, a small pool of blood emerging. In unison, they both place their hands side by side on the box.');
        this.options = [{ id: 59, text: 'Continue >' }];
        break;
      case 59:
        let unlock = new Audio();
        unlock.src = '../assets/Sound Effects/unlock.mp3';
        unlock.load();
        setTimeout(() => {
          unlock.play();
        }, 500);
        let glow = new Audio();
        glow.src = '../assets/Sound Effects/aura.mp3';
        glow.load();
        setTimeout(() => {
          glow.play();
        }, 1000);
        this.dialogue.unshift('The two streams of blood, indigo and crimson, begin to flow through the grooves of the crest of the Fae Queen. Suddenly, you hear a click and a blinding light poors out of the box as it begins to open.');
        this.options = [{ id: 61, text: 'Continue >' }];
        break;
      case 60:
        this.router.navigate(['/outro']);
        break;
      case 61:
        this.portraitID = "../../assets/Final Picks/Characters/fae_queen.jpg";
        this.npcTag = 'Fae Queen: ';
        this.dialogue.unshift('When the blinding light dissapates you see a strange figure coalesce in front of you. Wings, leaves, antlers, hair, tentacles, an amalgamation of a million differnt things. And in your heart you feel an indescribable mixture of emotion. You\'re awed, entranced, terrified, weirdly aroused.');
        this.options = [
          { id: 62, text: 'Continue >' }
        ];
        break;
      case 62:
        this.npcDialogue('"Greeting strange traveller. You have done me, and my people, a grand service by freeing me from my imprisonment. In exchange, I shall pay my debt to you by granting you one wish. What is it that you desire?"');
        this.options = [
          { id: 63, text: '"Well, I was kind of promised 500 gold"' },
          { id: 64, text: '"I need no reward, your highness. It is enough to see your great people united again."' }
        ];
        if (this.PC.pcid === 1) {
          this.options.unshift({ id: 65, text: '"Priscilla and I . . . do you think we could be human again?"' });
        } else if (this.PC.pcid === 2) {
          this.options.unshift({ id: 66, text: '"Do you have any secret texts? Knowledge of the fae that you might grant to me?"' });
        } else if (this.PC.pcid === 3) {
          this.options.unshift({ id: 67, text: '"Are you familiar with the Ohio Titny Lions? Could you make them win the Dwarfball Championship?"' });
        }
        break;
      case 63:
        this.addPCDialogue(event.text);
        this.npcDialogue('The Queen waves her hand and transforms a nearby pillar of stone into a sack of gold. "Here, child. Take your wealth and depart this place." You grab the sack, whose weight implies well in excess of 500 gold pieces.');
        this.options = [
          { id: 60, text: '"Pleasure doing business with you your highness," you say as you make for the door.' },
          { id: 60, text: '"Welp, smell ya later." You give a wave to the two fae as you turn and leave.' }
        ];
        this.sharedService.ending = 2;
        break;
      case 64:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Unacceptable," she states in a booming voice. "The Fae Queen shall be indebted to no mortal. If you shall not choose a boon, one shall be granted for you." She waves a hand and magical sparkles surround you.');
        this.options = [{ id: 68, text: '"Uuuuhhhhh what did you do?" you ask looking at your hands.' }]
        break;
      case 65:
        this.addPCDialogue(event.text);
        this.dialogue.unshift('The Queen raises a hand and magical sparkles pour out from it, surrounding you. You look down at your hands to see flesh begin to cover your spindly fingers, and, for the first time in as long as you can remember, you feel the warmth of blood coursing through your veins.');
        this.PC.image_URL = '../../assets/Final Picks/Characters/pollen_human.png';
        this.options = [{ id: 69, text: 'Turn to look at Priscilla.' }]
        break;
      case 66:
        this.addPCDialogue(event.text);
        this.npcDialogue(' She waves a hand and a large, leatherbound tome appears in your hands. "Here. Our most secret and sacred text." You flip through the pages. Its text will require some translation, but the illustrations suggest that it is *deeply* erotic.');
        this.options = [
          { id: 72, text: '"Jackpot . . . " you whisper under your breath, like the weird little perv that you are. It was better than you had even dared to hope.' }
        ];
        break;
      case 67:
        this.addPCDialogue(event.text);
        this.npcDialogue('"I  . . . don\'t follow. This is a sports thing?"');
        this.options = [{ id: 73, text: '"Yeah. There\'s this sports team, and they\'re from Ohio, and they\'re called the Titny Lions, and I want them to win the big tournament this year."' }]
        break;
      case 68:
        this.addPCDialogue(event.text);
        if (this.PC.pcid === 1) {
          this.npcDialogue('"You have my blessing, skellington. You may stay and live among us if you wish. You know, since you\'re all sad and lonely normally."')
          this.sharedService.ending = 3;
        } else {
          if (this.PC.hasShitPants) {
            this.PC.hasShitPants = false;
            this.npcDialogue('"I have unshit your pants. Go in peace, child."');
            this.options = [
              { id: 60, text: '"Uhh, yeah, great, thanks," you mumble awkwardly as you turn to leave.' }
            ]
          } else {
            this.npcDialogue('"You now have a really big weiner."');
            this.options = [{ id: 60, text: '"Aw hell yeah," you exclaim, turning to take your leave from the court.' }]
          }
          this.sharedService.ending = 2;

        }
        break;
      case 69:
        this.portraitID = "../../assets/Final Picks/Characters/Priscilla.jpg";
        this.dialogue.unshift('You see a young woman standing before you. She looks up into your eyes and smiles softly.');
        this.options = [{
          id: 70, text: '"Priscilla . . . I\'m so sorry. It was an accident. I tried to fix it."'
        }]
        break;
      case 70:
        this.npcTag = 'Priscilla: ';
        this.addPCDialogue(event.text);
        this.npcDialogue('"It\'s ok, Pollen. Thanks for taking care of me all these years."');
        this.options = [{ id: 71, text: '"Let\'s go home."' }];
        break;
      case 71:
        this.npcTag = 'Fae Queen: ';
        this.portraitID = "../../assets/Final Picks/Characters/fae_queen.jpg";
        this.PC.image_URL = '../../assets/Final Picks/Characters/pollen_and_priscilla.png';
        this.npcDialogue('"Go in peace my children."');
        this.options = [
          { id: 60, text: '"Thank you, your highness. We shall never forget you," you say as you turn to leave.' }
        ]
        this.sharedService.ending = 4;
        break;
      case 72:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Go in peace, my child."');
        this.options = [
          { id: 60, text: '"Pleasure doing business with you your highness," you say as you make for the door.' },
          { id: 60, text: '"Welp, smell ya later." You give a wave to the two fae as you turn and leave.' }
        ];
        this.sharedService.ending = 2;
        break;
      case 73:
        this.addPCDialogue(event.text);
        this.npcDialogue('"So your greatest desire, in all the world, is to have a group of people you\'ve never met win a sporting event that will have no bearing on your life?"');
        this.options = [{ id: 74, text: '"Duh."' }]
        break;
      case 74:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Uh, sure." She waves a hand which sparkles magically.');
        this.options = [{ id: 75, text: '"Ooh baby! Gonna put a fat bet on that! That\'s 500 gold and a Titny Lions victory," you say, quite smugly.' }];
        break;
      case 75:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Yes, wonderful. Now please take your leave of this place."');
        this.options = [
          { id: 60, text: '"Pleasure doing business with you your highness," you say as you make for the door.' },
          { id: 60, text: '"Welp, smell ya later." You give a wave to the two fae as you turn and leave.' }
        ];
        this.sharedService.ending = 2;
        break;
    }
  }

}
