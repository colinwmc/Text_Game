import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { item } from '../models';

@Component({
  selector: 'app-title-screen',
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css']
})
export class TitleScreenComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  public index = 0;
  public PCs: any;
  public selectedPC: any;
  public image ="../../assets/Final Picks/Characters/bartender.png";

  ngOnInit(): void {
     this.sharedService.getPCList().subscribe(data => {
      this.PCs = data;
      for (let PC of this.PCs){
        PC.currentHealth = PC.hp;
        PC.hasShitPants = false;
        let gold:item ={
          itemID: 13,
          itemDescription: 'Can be exchanged for goods and services.',
          itemName: 'Gold',
          itemQuantity: 10,
          imageID: ''
      }
        PC.items.push(gold)
      }
     })
  }

  menuAdvance() {
    this.index++
  }
  menuBack() {
    this.index--
    this.selectedPC = null;
  }

  selectPC(PC: any){
    this.selectedPC = PC;
    this.sharedService.PC = PC;
    this.index = 2;
  }

}
