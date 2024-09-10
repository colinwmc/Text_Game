import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleScreenComponent } from './title-screen/title-screen.component';
import { IntroComponent } from './intro/intro.component';
import { TavernComponent } from './tavern/tavern.component';
import { FortuneTellersRoomComponent } from './fortune-tellers-room/fortune-tellers-room.component';

const routes: Routes = [
  { path: '', component: TitleScreenComponent },
  { path: 'title', component: TitleScreenComponent },
  { path: 'intro', component: IntroComponent },
  { path: 'tavern', component: TavernComponent },
  { path: 'fortune', component: FortuneTellersRoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
