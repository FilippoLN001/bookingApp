import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { NavController } from '@ionic/angular';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-reservation',
  standalone: false,
  templateUrl: './reservation.page.html',
  styleUrls: ['./reservation.page.scss'],
})
export class ReservationPage implements OnInit {

  booking = {
    name: '',
    participants: 0,
    document: '',
    imageUrl: '',
    date: ''
  };

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private bookingService: BookingService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const selectedDate = this.bookingService.getSelectedDate();
      this.booking.date = selectedDate || '';
      this.isFormComplete();
    });
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });
    const base64Data = await this.readAsBase64(image.webPath!);
    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    this.booking.document = fileName;
    this.booking.imageUrl = image.webPath!;
    console.log(this.booking.imageUrl);
  }

  async readAsBase64(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }

  async submitForm() {
    if(this.isFormComplete()){

      console.log('Booking details:', this.booking);
      const reservations = await Preferences.get({ key: 'reservations' });
      const currentReservations = reservations.value ? JSON.parse(reservations.value) : [];
      currentReservations.push(this.booking);
      await Preferences.set({ key: 'reservations', value: JSON.stringify(currentReservations) });

      this.navCtrl.navigateForward('/reservation-list');
    }
  }

  isFormComplete() : boolean{
    return  !! (this.booking.name && this.booking.participants>0 && this.booking.imageUrl)
  }
}
