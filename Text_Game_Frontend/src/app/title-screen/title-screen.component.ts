import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

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

  ngOnInit(): void {
     this.sharedService.getPCList().subscribe(data => {
      this.PCs = data;
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
    this.index = 2;
  }

}
