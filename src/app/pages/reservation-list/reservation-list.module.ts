import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationListPageRoutingModule } from './reservation-list-routing.module';

import { ReservationListPage } from './reservation-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationListPageRoutingModule
  ],
  declarations: [ReservationListPage]
})
export class ReservationListPageModule {}
