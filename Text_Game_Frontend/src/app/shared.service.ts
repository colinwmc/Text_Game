import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private APIUrl = "https://localhost:7125/api";
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application.json',
    }),
  };
  constructor(private http: HttpClient) { }

  public PC: any;
  

  getPCList(): Observable<any[]> {
    return this.http.get<any[]>(this.APIUrl + '/PC', this.httpOptions);
  }

  skillCheck(modifier:string, dc:number, special:string) {
    let diceRoll = new Audio();
    diceRoll.src = "../assets/Sound Effects/rpg-dice-rolling-95182.mp3";
    diceRoll.load();
    diceRoll.play();

    let roll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
    if(special === 'advantage'){
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if(secondRoll > roll){
        roll = secondRoll;
      }
    } else if(special === 'disadvantage'){
      let secondRoll = Math.floor(Math.random() * (20 - 1 + 1) + 1);
      if(secondRoll < roll){
        roll = secondRoll;
      }
    }
    let modValue = Math.floor((this.PC[modifier]-10)/2);
    return roll+modValue >= dc;
   
  }
}
