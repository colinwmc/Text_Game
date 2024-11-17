import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-hungry-vampire',
  templateUrl: './hungry-vampire.component.html',
  styleUrls: ['./hungry-vampire.component.css']
})
export class HungryVampireComponent implements OnInit {

  public PC: any;
  public resetPC: any;
  public narration: string = '';
  public dialogue: any[] = [];
  public options: any[] = [];
  public portraitID: string = '';
  public backpackOpen = false;
  public npcTag = 'Quiet Lady: ';
  public hasChecked = false;
  public badSense = false;

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
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. As you progress, the trees grow denser and taller. And as the light of the moon is incresingly blocked out by the canopy, the woods become darker and more ominous."
    this.options = [{ id: 0, text: 'Continue >' }];
  }

  resetEncounter() {
    this.PC = JSON.parse(JSON.stringify(this.resetPC));
    this.sharedService.PC = this.PC;
    this.dialogue = [];
    this.narration = "You continue deeper into the forest, still shaken from your last encounter. As you progress, the trees grow denser and taller. And as the light of the moon is incresingly blocked out by the canopy, the woods become darker and more ominous."
    this.options = [{ id: 0, text: 'Continue >' }];
    this.backpackOpen = false;
  }

  addPCDialogue(text: string) {
    this.dialogue.unshift(this.PC.name + ': ' + text);
  }

  npcDialogue(text: string) {
    this.dialogue.unshift(this.npcTag + text);
  }

  npcDies() {
    this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire_dead.jpg"
  }

  optionSelection(event: any) {

    switch (event.id) {
      case 0:
        this.narration = 'Your journey passes peacefully for a time, until you see something in the middle distance.';
        this.options = [{ id: 1, text: 'Continue >' }];
        break;
      case 1:
        this.narration = 'A lone figure stands in the middle of the path. As you move closer, you see what appears to be a young woman in a red cloak. She lacks any of the vibrant pressence of your last encounter. Rather, she appears cold and afraid, paper thin and sickly pale.';
        this.options = [{ id: 2, text: 'Continue >' }];
        break;
      case 2:
        this.narration = 'As you approach, she looks up at you, eyes filled with fear, desperation, and tears. Her lip quivers as she begins to speak with an impossibly small voice . . .';
        this.options = [{ id: 3, text: 'Continue >' }];
        break;
      case 3:
        this.narration = '';
        this.portraitID = "../../assets/Final Picks/Characters/hungry_vampire.png";
        this.npcDialogue('"H-hi . . ."');
        this.options = [
          { id: 5, text: '"Hello there ma\'am. Are you ok?"' }
        ];
        break;
      case 4:
        this.hasChecked = true;
        if (this.sharedService.skillCheck('wisdom', 10, 'none')) {
          this.dialogue.unshift('(Success!) You look the woman over. She has 5 fingers on each hand, standard porportions, and no strange abnormalities. You have no sense that this woman is a fae in disguise, but perhaps you still sense some danger in her sad, ruby eyes.');
          this.badSense = true;
        } else {
          this.dialogue.unshift('(Success!) You look the woman over. She has 5 fingers on each hand, standard porportions, and no strange abnormalities. You have no sense that this woman is a fae in disguise.');
        }
        break;
      case 5:
        this.addPCDialogue(event.text);
        this.options = [];
        break;
    }
    if (event.id >= 3 && !this.hasChecked) {
      this.options.push({ id: 4, text: 'Look her over, head to toe. See if anything seems off. (Wisdom Perception Check)' });
    }
  }

}
