import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReservationPageRoutingModule } from './reservation-routing.module';

import { ReservationPage } from './reservation.page';
import { ActivatedRoute } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReservationPageRoutingModule
  ],
  declarations: [ReservationPage]
})
export class ReservationPageModule {


selectedDate: string | undefined;

  constructor(private route: ActivatedRoute) {}

 
ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedDate = params['date'];
      console.log('Selected date:', this.selectedDate);
    });
  }
}
