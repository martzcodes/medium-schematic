import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DummyGuard } from '@martzcodes/core';
const routes: Routes = [
  {
    path: 'asdf',
    loadChildren: './asdf/asdf.module#AsdfModule',
    canLoad: [DummyGuard]
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
