import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-outro',
  templateUrl: './outro.component.html',
  styleUrls: ['./outro.component.css']
})
export class OutroComponent implements OnInit {

  constructor(private sharedService: SharedService, private router: Router) { }

  //ending 1: returns artifact to lesoule
  //ending 2: receives a reward from fae queen, leaves
  //ending 3: pollen stays in court
  //ending 4: pollen leaves with priscilla

  public index = 0;
  public textArray: any = [];

  ngOnInit(): void {
    if (this.sharedService.ending === 1) {
      this.textArray = ['You make your way back to the Half Light Inn.',
        'The fortune teller gratiously accepts the artifact from you and presents you your reward.',
        'As you walk away from the tavern, content with a successful mission and a king\'s ransom, you feel something on your left thigh.',
        'The bag of gold on your hip has a hole in it, and sand leaks from the sack and runs down your leg. You open it to see that all your gold has turned to dust.',
        'Distraught, you turn back to the Inn, ready to demand an explanation from the fortune teller.',
        'But as you turn to look . . . it isn\'t there . . . ',
      ]
    } else if (this.sharedService.ending === 2) {
      this.textArray = [
        'You take your leave from the court of the Fae Queen, relieved that your quest was finally at an end.',
        'Did you do the right thing? Was this a happy ending? You hope so, though it\'s hard to say.',
        'If nothing else, you walk away with your life and an ample reward. It was a happy ending for you, at least.',
        'Suddenly, you feel a sharp pain in your right thigh.',
        'You reach into your pocket to pull out the advirtisement for the quest, and watch as the words on the page slowly burn away.',
        'When the paper is finally wiped clean, new words begin to arise in their place: ',
        'You\'ve made a powerful enemy today, traveller.',
        '-Madame LeSoule'
      ]
    } else if (this.sharedService.ending === 3) {
      this.textArray = [
        'You look around the court, taking in your new home.',
        'Did you do the right thing? Was this a happy ending? You hope so, though it\'s hard to say.',
        'If nothing else, you survived and found a new place to call your own. It was a happy ending for you, at least.',
        'Suddenly, you feel a sharp pain in your right thigh.',
        'You reach into your pocket to pull out the advirtisement for the quest, and watch as the words on the page slowly burn away.',
        'When the paper is finally wiped clean, new words begin to arise in their place: ',
        'You\'ve made a powerful enemy today, traveller.',
        '-Madame LeSoule'
      ]
    } else if (this.sharedService.ending === 4) {
      this.textArray = [
        'You take your leave from the court of the Fae Queen, walking hand in hand with your long time friend, relieved that your quest was finally at an end.',
        'Did you do the right thing? Was this a happy ending? You hope so, though it\'s hard to say.',
        'But you and your friend have been given a second chance at life, a reward greater than any you dared imagine. It was a happy ending for you, at least.',
        'Suddenly, you feel a sharp pain in your right thigh.',
        'You reach into your pocket to pull out the advirtisement for the quest, and watch as the words on the page slowly burn away.',
        'When the paper is finally wiped clean, new words begin to arise in their place: ',
        'You\'ve made a powerful enemy today, traveller.',
        '-Madame LeSoule'
      ]
    }
  }

  advance() {
    if (this.index < this.textArray.length) {
      this.index++
    } else {
      this.router.navigate(['/title'])
    }

  }

}
