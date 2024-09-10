import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleScreenComponent } from './title-screen/title-screen.component';

import { HttpClientModule } from "@angular/common/http";
import { SharedService } from "./shared.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PCProfileComponent } from './pc-profile/pc-profile.component';
import { IntroComponent } from './intro/intro.component';
import { TavernComponent } from './tavern/tavern.component';
import { UiOverlayComponent } from './ui-overlay/ui-overlay.component';
import { FortuneTellersRoomComponent } from './fortune-tellers-room/fortune-tellers-room.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleScreenComponent,
    PCProfileComponent,
    IntroComponent,
    TavernComponent,
    UiOverlayComponent,
    FortuneTellersRoomComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
