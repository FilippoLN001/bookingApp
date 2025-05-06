import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InfiniteScrollCustomEvent, LoadingController, NavController } from '@ionic/angular';
import { BookingService, ApiResult } from 'src/app/services/booking.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  booking: any[] = [];
  holidays: string[] = [];
  showButton = false;
  selectedDate: string | undefined;
  dateSelectedFlag = false;
  reservedDates: string[] = []; // Array for reserved dates
  today!: string;

  constructor(private bookingService: BookingService, private loadingCtrl: LoadingController, private route: ActivatedRoute, private navCtrl: NavController) { }

  async ngOnInit() {
    await SplashScreen.show({
      showDuration: 3000,
      autoHide: true,
    });
    this.loadCalendar();
    this.loadHolidays();
    // const storedDate = await Preferences.get({ key: 'selectedDate' });
    // this.selectedDate = storedDate.value ? storedDate.value : undefined;
    await this.loadReservedDates();
    this.today = new Date().toISOString().split('T')[0];
    await this.checkAndSelectDate();
  }

  ionViewWillEnter() { //ion lifecycle
    this.loadReservedDates(); // Load reserved dates every time the page is shown
  }

  dateSelected(event: any) {
    if (event.detail.value) {
      const fullDate = new Date(event.detail.value);
      this.selectedDate = fullDate.toISOString().split('T')[0];
      console.log(this.selectedDate);
      this.showButton = true;
      this.bookingService.setSelectedDate(this.selectedDate);
      Preferences.set({ key: 'selectedDate', value: this.selectedDate });
    }
  }

  reserve() {
    console.log('Booking button clicked!');
    this.dateSelectedFlag = true;
    this.navCtrl.navigateForward(`/reservation?date=${this.selectedDate}`);
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();

    if (this.holidays.includes(dateString) || this.reservedDates.includes(dateString)) { // deactivate the holidays and date selected
      return false;
    }

    return utcDay !== 0 && utcDay !== 6;
  };

  async loadCalendar(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Caricamento',
      spinner: 'dots',
    });
    await loading.present();

    this.bookingService.getHolidays().subscribe((res: ApiResult[]) => {
      loading.dismiss();
      if (Array.isArray(res)) {
        this.booking.push(...res.map(holiday => holiday.date));
      } else {
        console.error('res is not an array:', res);
      }
      console.log(res);
      event?.target.complete();
    });
  }

  loadHolidays() {
    this.bookingService.getHolidays().subscribe((res: ApiResult[]) => {
      this.holidays = res.map(holiday => holiday.date);
      console.log(this.holidays);
    });
  }

  async loadReservedDates() {
    const reservations = await Preferences.get({ key: 'reservations' });
    this.reservedDates = reservations.value ? JSON.parse(reservations.value).map((res: any) => res.date) : [];
    console.log(this.reservedDates);
  }

  findNextAvailableDate(startDate: string): string {
    let nextDate = new Date (startDate);
    while(this.reservedDates.includes(nextDate.toISOString().split('T')[0])
    || !this.isWeekday(nextDate.toISOString().split('T')[0])){
      nextDate.setDate(nextDate.getDate() + 1);
    }
    return nextDate.toISOString().split('T')[0];
  }

  async checkAndSelectDate(){
    const today = new Date().toISOString().split('T')[0];
    if(this.reservedDates.includes(today)){
      this.selectedDate = this.findNextAvailableDate(today);
    }else{
      this.selectedDate = today;
    }
    this.showButton = true;
    this.bookingService.setSelectedDate(this.selectedDate);
    await Preferences.set({key: 'selectedDate', value: this.selectedDate});
  }
}
