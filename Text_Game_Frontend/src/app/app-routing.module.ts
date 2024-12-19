import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleScreenComponent } from './title-screen/title-screen.component';
import { IntroComponent } from './intro/intro.component';
import { TavernComponent } from './tavern/tavern.component';
import { FortuneTellersRoomComponent } from './fortune-tellers-room/fortune-tellers-room.component';
import { FrogMerchantEncounterComponent } from './frog-merchant-encounter/frog-merchant-encounter.component';
import { SeductressEncounterComponent } from './seductress-encounter/seductress-encounter.component';
import { MothMonsterComponent } from './moth-monster/moth-monster.component';
import { HungryVampireComponent } from './hungry-vampire/hungry-vampire.component';
import { TravellerComponent } from './traveller/traveller.component';
import { IllusionistComponent } from './illusionist/illusionist.component';
import { RiddleTellerComponent } from './riddle-teller/riddle-teller.component';
import { TempleComponent } from './temple/temple.component';
import { OutroComponent } from './outro/outro.component';

const routes: Routes = [
  { path: '', component: TitleScreenComponent },
  { path: 'title', component: TitleScreenComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'tavern', component: TavernComponent },
  { path: 'fortune', component: FortuneTellersRoomComponent },
  { path: 'frog', component: FrogMerchantEncounterComponent },
  { path: 'seductress', component: SeductressEncounterComponent },
  { path: 'moth', component: MothMonsterComponent },
  { path: 'vamp', component: HungryVampireComponent },
  { path: 'traveller', component: TravellerComponent},
  { path: 'illusionist', component: IllusionistComponent},
  { path: 'riddle', component: RiddleTellerComponent},
  { path: 'temple', component: TempleComponent},
  { path: 'outro', component: OutroComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
