import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pc-profile',
  templateUrl: './pc-profile.component.html',
  styleUrls: ['./pc-profile.component.css']
})
export class PCProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() PC: any;

}
