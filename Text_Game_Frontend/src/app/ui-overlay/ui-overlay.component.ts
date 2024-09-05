import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-ui-overlay',
  templateUrl: './ui-overlay.component.html',
  styleUrls: ['./ui-overlay.component.css']
})
export class UiOverlayComponent implements OnInit {

  public PC: any;
  public currentOptions:String[] = [];
  public currentDialogue:String[] = [];
  public currentNarration = 'You open the door to see a small, wooden room, half lit and half full. Provincial folk look up from their beer and potatoes to cast you suspicous looks. The bartender fixes you with an empty stare and reluctantly waves you over.';
  public hasContinue = true;
  public backpackOpen = false;
  public index = 0;
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
    this.currentOptions = ['The first option', 'The second option'];
    this.currentDialogue.unshift('Howdy, Stranger'+this.index);
    this.index++;
    this.currentNarration = "";
    this.hasContinue = false;
    // this.ngAfterViewInit()
  }

  tapBackpack(){
    this.backpackOpen = !this.backpackOpen;
  }

//   @ViewChildren('newline') lines: QueryList<ElementRef> | undefined
//   ngAfterViewInit()
//   {
//     this.lines?.changes.subscribe(list=>{
//       setTimeout(()=>
//         list.last.nativeElement.focus(), 0)
//     })
//   }

 }
