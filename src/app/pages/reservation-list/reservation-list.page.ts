import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { IonContent, ScrollDetail } from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';

export interface Reservation {
  name: string;
  participants: number;
  document: string;
  imageUrl: string;
  date: string;
}

@Component({
  selector: 'app-reservation-list',
  standalone:false,
  templateUrl: './reservation-list.page.html',
  styleUrls: ['./reservation-list.page.scss'],
})
export class ReservationListPage implements OnInit {
  reservations: Reservation[] = [];
  currentPage = 1;
  selectedDate: string | undefined;

  constructor() { }

  async ngOnInit() {
    await this.loadReservations();
  }

  async loadReservations() {
     const reservations = await Preferences.get({ key: 'reservations' });
     this.reservations = reservations.value ? JSON.parse(reservations.value) : [];
     console.log(this.reservations);
     }
async clearReservations() {
   await Preferences.remove({ key: 'reservations' });
   this.reservations = [];
   console.log('Reservations cleared');
   }

   handleScrollStart() {
    console.log('scroll start');
  }

  handleScroll(event: CustomEvent<ScrollDetail>) {
    console.log('scroll', JSON.stringify(event.detail));
  }

  handleScrollEnd() {
    console.log('scroll end');
  }


async share(reservation: Reservation) {
   await Share.share({
   text: `Reservation Name: ${reservation.name}\nParticipants: ${reservation.participants}\nDate: ${reservation.date}`,
   url: reservation.imageUrl // Optional: if you want to share the image URL
   });
  }

}
