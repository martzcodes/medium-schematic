import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // added
// unused imports removed
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule], // updated
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
