import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  constructor() { }

  public index = 0;
  public currentText = "After 5 days travelling, you finally near your destination."
  public textArray =[
    "After 5 days travelling, you finally near your destination.",
    "You look down at the well worn paper in your hands, it reads:",
    "Missing Artifact. 500 gold reward for its recovery. Contact Madame LeSoule at the Half Light Inn.",
    "At long last, you finally reach the tiny tavern at the edge of the forest.",
    ""
  ]

  ngOnInit(): void {
  }

  advance(){
    this.index++
    this.currentText = this.textArray[this.index];
  }


}
