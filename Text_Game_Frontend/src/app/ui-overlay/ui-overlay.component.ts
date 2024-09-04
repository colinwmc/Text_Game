import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-ui-overlay',
  templateUrl: './ui-overlay.component.html',
  styleUrls: ['./ui-overlay.component.css']
})
export class UiOverlayComponent implements OnInit {

  public PC: any;
  public currentOptions = ['The first option', 'The second option'];
  public currentDialogue = '';
  public currentNarration = '';
  public hasContinue = false;
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    if(this.sharedService.PC){
    this.PC = this.sharedService.PC;
    } else {
      this.sharedService.getPCList().subscribe(data => {
        this.PC = data[0];
        this.PC.currentHealth = this.PC.hp;
        this.PC.hasShitPants = false;
      })
    }
  }

  proceed(){
    this.currentOptions = [];
    this.currentNarration = "You open the door to see a small, wooden room, half lit and half full. Provincial folk look up from their beer and potatoes to cast you suspicous looks. The bartender fixes you with an empty stare and reluctantly waves you over.";
    this.hasContinue = true;
  }


}
