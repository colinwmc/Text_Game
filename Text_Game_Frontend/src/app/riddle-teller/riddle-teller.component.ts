import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-riddle-teller',
  templateUrl: './riddle-teller.component.html',
  styleUrls: ['./riddle-teller.component.css']
})
export class RiddleTellerComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Temple Guard: ';
  public hasAcknowledgedPoop = false;
  public riddleArray = [
    { question: '"What gets wetter the more it dries?"', options: [{ id: 20, text: 'b---d' }, { id: 22, text: 't---l' }, { id: 20, text: 'c----t' }, { id: 20, text: 'h--r' }] },
    { question: '"What tree do we all carry in our hands?"', options: [{ id: 20, text: 'c---r' }, { id: 20, text: 'o-k' }, { id: 20, text: 'e--------s' }, { id: 23, text: 'p--m' }] },
    { question: '"I can\'t be seen, but I can be heard. I won\'t answer until spoken to. What am I?"', options: [{ id: 20, text: 'd---m' }, { id: 20, text: 'c------n' }, { id: 24, text: 'e--o' }, { id: 20, text: 'v---e' }] },
    { question: '"Cut me and I won\'t cry, but you will. What am I?"', options: [{ id: 20, text: 's--g' }, { id: 20, text: 's-------t' }, { id: 20, text: 'k---e' }, { id: 25, text: 'o---n' }] },
    { question: '"If you have it, you want to share it. If you share it, you don\'t have it anymore. What is it?"', options: [{ id: 20, text: 'l--e' }, { id: 20, text: 't----t' }, { id: 26, text: 's-----t' }, { id: 20, text: 'h-------s' }] },
    { question: '"I have a neck and wear a cap, but I don\'t have a head. What am I?"', options: [{ id: 20, text: 'g---t' }, { id: 27, text: 'b----e' }, { id: 20, text: 's---e' }, { id: 20, text: 'c--m' }] },
    { question: '"Pick me up and scratch my head. I\'ll turn red and then black. What am I?"', options: [{ id: 28, text: 'm---h' }, { id: 20, text: 'c----e' }, { id: 20, text: 'c---------r' }, { id: 20, text: 'a---l' }] },
    { question: '"What is as light as a feather but can\'t be held by anyone for very long?"', options: [{ id: 20, text: 't----e p---r' }, { id: 20, text: 'a b--y' }, { id: 20, text: 'y--r w--d' }, { id: 29, text: 'y--r b----h' }] },
    { question: '"I will crack if you drop me. If you smile at me, I\'ll smile back. What am I?"', options: [{ id: 20, text: 'e-g' }, { id: 30, text: 'm----r' }, { id: 20, text: 'v--e' }, { id: 20, text: 'p----t' }] },
    { question: '"The more you take, the more you leave behind. What are they?"', options: [{ id: 31, text: 'f-------s' }, { id: 20, text: 'm------s' }, { id: 20, text: 'c---s' }, { id: 20, text: 'p------s' }] },
    { question: '"What goes up but never comes down?"', options: [{ id: 20, text: 'b---s' }, { id: 32, text: 'a-e' }, { id: 20, text: 'b-----n' }, { id: 20, text: 'd----s' }] },
    { question: '"What is full of holes but still holds water?"', options: [{ id: 20, text: 'b----t' }, { id: 20, text: 'p-----r' }, { id: 20, text: 'h--e' }, { id: 33, text: 's----e' }] },
  ];
  public riddleIndex = 0;
  public rightAnswers = 0;
  public wrongAnswers = 0;
  public right: any;
  public wrong: any;

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
    this.narration = "After what felt like hours of travel, and numerous daring escapes from deadly foes, you reach a clearing in the woods. A temple stands before you, the pale stone glowing in the moonlight. Surely this is the destination the Madame spoke of."
    this.options = [{ id: 0, text: 'Continue >' }];
    let right = new Audio();
    this.right = right;
    right.src = "../assets/Sound Effects/correct.mp3";
    right.load();

    let wrong = new Audio();
    this.wrong = wrong;
    wrong.src = "../assets/Sound Effects/wrong.mp3";
    wrong.load();
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "After what felt like hours of travel, and numerous daring escapes from deadly foes, you reach a clearing in the woods. A temple stands before you, the pale stone glowing in the moonlight. Surely this is the destination the Madame spoke of."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
    this.npcTag = 'Temple Guard: ';
    this.hasAcknowledgedPoop = false;
    this.riddleIndex = 0;
    this.rightAnswers = 0;
    this.wrongAnswers = 0;
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
        this.narration = 'Though the imposing structure remains in decent shape, it also appears clearly abandoned. There are no signs of life as you walk your way through concentric rings of stones and pillars.';
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.narration = 'As make your way up the steps to the front door, suddenly, a figure appears. It drops down from above landing deftly on the arch above the entrance.';
        this.options = [{ id: 2, text: 'Continue >' }];
        break;
      case 2:
        this.narration = '';
        this.portraitID = "../../assets/Final Picks/Characters/riddle_teller.jpeg";
        let dialogue1 = '"My, my, my. What have we here? A strange little ';
        let type = this.PC.pcid === 1 ? 'skellington' : this.PC.pcid === 2 ? 'elf' : 'dwarf';
        let dialogue2 = ' so far from home. Come to me with eyes filled with dreams ';
        let dialogue3 = this.PC.hasShitPants ? 'and pants filled with poop."' : 'and a heart filled with fear."'
        this.npcDialogue(dialogue1 + type + dialogue2 + dialogue3);
        let option = this.PC.hasShitPants ? { id: 5, text: '"I hardly think that\'s necessary to bring up." You mutter, adjusting your trousers awkwardly.' } : { id: 6, text: '"There is no fear in my heart." You puff your chest out, trying to project confidence.' };
        this.options = [
          { id: 3, text: '"I am not strange. Not so strange as you at least."' },
          { id: 4, text: '"And what sort of creature are you? I\'ve never encountered a thing quite like you."' },
          option
        ];
        break;
      case 3:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No. Perhaps you\'re not so strange, but you are certainly a stranger. And what business does a stranger have showing up at my door?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 4:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Incorrect. You\'ve met several creatures such as me. But all of them were pretending to be something else at the time. I stand before you exactly as I so choose to be."');
        this.options = [
          { id: 7, text: '"You\'re a fae? Is this what fae really look like? Their true form?"' },
          { id: 8, text: '"And whay aren\'t you shapeshifted, then? You don\'t have any tricks for me?"' },
          { id: 9, text: '"Have you considered choosing to look like something else?" you state, bitchily.' }
        ]
        break;
      case 5:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And it was hardly necessary for you to show up at my doorstep smelling of excrement, yet here you are. And I\'m currently enquiring as to why."');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 6:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Incorrect. But do not take it as an insult. It is only proper that you be afraid."');
        this.options = [
          { id: 10, text: '"Fear or no, I will be entering this temple to complete my quest."' },
          { id: 12, text: '"And what should I be afraid of then? You?"' }
        ]
        break;
      case 7:
        this.addPCDialogue(event.text);
        this.npcDialogue('"This is what *this* fae looks like, though it\'s impossible to say if a fae can have a true form at all. It is, however, *I* who will be asking the questions here, and up to you to provide the answers. To begin, why are you here and what do you want?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 8:
        this.addPCDialogue(event.text);
        this.npcDialogue('"The fae shapeshift to blend in when they are outsiders in strange lands. But this is our temple, and the only outsider here is you. And why, in fact, are you here?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 9:
        this.addPCDialogue(event.text);
        this.npcDialogue('"Never for the sake of one such as you," the creature states, firmly ennunciating each word. "Now why have you come, and what do you want?"');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 10:
        this.addPCDialogue(event.text);
        this.npcDialogue('"And I shall grant entrance to thee if you first answer my riddles three."');
        this.options = [
          { id: 13, text: '"Oh gods . . . you can\'t be serious."' },
          { id: 14, text: '"Ok . . ."' },
          { id: 15, text: '"Sounds like fun."' }
        ]
        break;
      case 11:
        this.addPCDialogue(event.text);
        let dialogue = '"I assure you I don\'t give a jackalope\'s fart about your *business';
        this.PC.hasShitPants ? dialogue += ',* though I am aggrieved that you\'ve made me smell it.' : dialogue += '.*';
        dialogue += ' All I want to know is whether you intend to go through this door."'
        this.npcDialogue(dialogue);
        this.options = [
          { id: 10, text: '"Yes. I need to enter the temple."' }
        ]
        break;
      case 12:
        this.addPCDialogue(event.text);
        this.npcDialogue('"No, no, not me. But then again perhaps yes. Tell me first, for what reason you stand before me."');
        this.options = [
          { id: 10, text: '"I am on a quest. It has brought me to this temple and I must enter it."' },
          { id: 11, text: '"My business is my own, wretched thing."' }
        ];
        break;
      case 13:
      case 14:
      case 15:
        this.addPCDialogue(event.text);
        let intro = event.id === 13 ? '"Oh, I most certainly am. For this is my solemn oath. ' : event.id === 14 ? '"' : '"Yes, indeed, but fun for whom? That\'s the question. ';
        this.npcDialogue(intro + 'Now, the rules are very simple. I will ask you a series of questions. If you can answer three corectly, I will allow you safe passage into this temple. However, if you answer three incorrectly, I will eat you."');
        this.options = [
          { id: 16, text: '"You\'re going to *eat* me? Why would you eat me?"' },
          { id: 17, text: '"Alright. Let\'s get started I suppose."' },
          { id: 18, text: '"Sigh . . . can\'t we just fight or something?"' }
        ]
        break;
      case 16:
      case 17:
      case 18:
        this.addPCDialogue(event.text);
        let start = event.id === 16 ? '"Because these are the rules, and I also I didn\'t eat dinner. ' : event.id === 17 ? '"Stupendous. ' : '"Absolutely not. How barbaric. ';
        this.npcDialogue(start + 'Now, for the first question:');
        this.prepareRiddles(this.riddleArray);
        this.options = [{ id: 19, text: 'Continue >' }];
        break;
      case 19:
        this.npcDialogue(this.riddleArray[this.riddleIndex].question);
        this.options = this.riddleArray[this.riddleIndex].options;
        break;
      case 20:
        this.riddleIndex++;
        this.wrongAnswers++;
        this.wrong.play();
        if (this.wrongAnswers === 1) {
          this.npcDialogue('"Oh dear, that\'s incorrect. One strike, but not to worry. On to the next."');
          this.options = [{ id: 19, text: 'Continue >' }];
        } else if (this.wrongAnswers === 2) {
          this.npcDialogue('"Incorrect again, I\'m afraid. That\'s two out of three. Starting to sweat a bit, I wonder? Here\'s your next question, best think carefully."');
          this.options = [{ id: 19, text: 'Continue >' }];
        } else {
          this.npcDialogue('"I\'m sorry to say that\'s again incorrect old chap. Well, we both know what happens now." The creature swoops down from their perch at lightning speed. It\'s jaw unhinges as you stare into the dark abyss of its mouth.');
          this.options = [{ id: 21, text: '"AAAAHAHHHH!' }];
        }
        break;
      case 21:
        this.sharedService.takeDamage(this.PC.hp);
        break;
      case 22:
      case 23:
      case 24:
      case 25:
      case 26:
      case 27:
      case 28:
      case 29:
      case 30:
      case 31:
      case 32:
      case 33:
        this.riddleIndex++;
        this.rightAnswers++;
        this.right.play();
        let beginning = '"';
        let end = this.rightAnswers === 1 ? 'That\'s your first right answer, let\'s see if you can get anymore."' : this.rightAnswers === 2 ? 'You\'ve got two right. Only one more and you\'re through the door."' : 'That\'s it, you\'ve done it. Three correct. I must admit I didn\'t think you had it in you."'
        this.npcDialogue(beginning + end);
        let id = this.rightAnswers === 3 ? 34 : 19;
        this.options = [{ id: id, text: 'Continue >' }];
        break;
      case 34:
        this.npcDialogue('"Well my strange acquaintance, your task here is complete. I bid thee farewell."');
        this.options = [
          { id: 35, text: '"A great victory from an impeccable mind."' },
          { id: 35, text: '"Thank the gods that bullshit\'s over."' },
          { id: 35, text: '"Smell ya later."' }
        ]
        break;
      case 35:
        this.router.navigate(['/temple'])
        break;
    }
  }

  prepareRiddles(array: any) {

    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;

  }

}
