import { Component, Input, ElementRef, OnInit, QueryList, ViewChildren, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-ui-overlay',
  templateUrl: './ui-overlay.component.html',
  styleUrls: ['./ui-overlay.component.css']
})
export class UiOverlayComponent implements OnInit {

  @Input() PC: any;
  @Input() currentOptions: any[] = [];
  @Input() currentDialogue: any[] = [];
  @Input() currentNarration = '';
  @Input() portraitID: string = '';
  // @Input() hasContinue = false;
  @Output() newSelection = new EventEmitter<string>();
  @Output() reset = new EventEmitter<string>();
  @Input() backpackOpen = false;

  constructor(public sharedService: SharedService) { }

  ngOnInit(): void {
  }

  selectOption(option: any) {
    if (this.PC.currentHealth > 0) {
      this.newSelection.emit(option)
    }
  }

  tapBackpack() {
    this.backpackOpen = !this.backpackOpen;
  }

  useItem(itemID: number) {
    this.sharedService.useItem(itemID)
  }

  restartScene(){
    this.reset.emit('reset');
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
