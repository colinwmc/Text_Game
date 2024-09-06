import { Component, Input, ElementRef, OnInit, QueryList, ViewChildren, Output, EventEmitter  } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-ui-overlay',
  templateUrl: './ui-overlay.component.html',
  styleUrls: ['./ui-overlay.component.css']
})
export class UiOverlayComponent implements OnInit {

  public PC: any;
  @Input() currentOptions:any[] = [];
  @Input() currentDialogue:any[] = [];
  @Input() currentNarration = '';
  @Input() portraitID: string = '';
  // @Input() hasContinue = false;
  @Output() newSelection = new EventEmitter<string>();
  public backpackOpen = false;

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

  selectOption(option:any){
    this.newSelection.emit(option)
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
