import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsdfRoutingModule } from './asdf-routing.module';
import { AsdfContainerComponent } from './asdf-container/asdf-container.component';

@NgModule({
  declarations: [AsdfContainerComponent],
  imports: [
    CommonModule,
    AsdfRoutingModule
  ]
})
export class AsdfModule { }
