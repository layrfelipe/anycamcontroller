import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControlsPageComponent } from './pages/controls-page/controls-page.component';
import { CameraComponent } from './components/camera/camera.component';
import { ControlsComponent } from './components/controls/controls.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlsPageComponent,
    CameraComponent,
    ControlsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
