import { CommonModule } from '@angular/common';
import { Component, inject, AfterViewInit } from '@angular/core';
import { RefresherCustomEvent, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList } from '@ionic/angular/standalone';
import { VideoitemComponent } from '../components/videoitem/videoitem.component';
import { DataService, Video} from '../services/data.service';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList, VideoitemComponent],
})
export class HomePage implements AfterViewInit {
  public platform: string = 'web';
  private data = inject(DataService);


  constructor() {}

  async ngAfterViewInit() {
    const info = await Device.getInfo();
    this.platform = info.platform;
    console.log(`*** in home platform: ${this.platform}`);

  }


  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  getVideos(): Video[] {
    return this.data.getVideos(this.platform);
  }
}
