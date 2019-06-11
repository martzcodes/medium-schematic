import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsdfContainerComponent } from './asdf-container/asdf-container.component';

const routes: Routes = [
  {
    path: '',
    component: AsdfContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsdfRoutingModule {}
