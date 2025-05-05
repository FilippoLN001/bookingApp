import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReservationListPage } from './reservation-list.page';

const routes: Routes = [
  {
    path: '',
    component: ReservationListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservationListPageRoutingModule {}
