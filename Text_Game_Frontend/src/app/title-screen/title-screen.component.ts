import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-title-screen',
  templateUrl: './title-screen.component.html',
  styleUrls: ['./title-screen.component.css']
})
export class TitleScreenComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
   this.sharedService.getPCList().subscribe(data => {
    console.log(data)
   })
  }

}
