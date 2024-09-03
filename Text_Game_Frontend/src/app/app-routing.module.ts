import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitleScreenComponent } from './title-screen/title-screen.component';
import { IntroComponent } from './intro/intro.component';

const routes: Routes = [
  { path: '', component: TitleScreenComponent },
  { path: 'title', component: TitleScreenComponent },
  { path: 'intro', component: IntroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
