import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoviewerComponent } from '../../components/photoviewer/photoviewer.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { base64Images } from '../../utils/base64Image';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, PhotoviewerComponent]
})
export class ViewerPage implements OnInit {
  imageList: any[] = [];
  mode: string;
  startFrom: number = 0;
  platform: string;

  constructor(private router: Router,
    private actRoute: ActivatedRoute) {
      this.mode = this.actRoute.snapshot.params["mode"];
      this.platform = Capacitor.getPlatform();

    }

  ngOnInit() {
    // define the image's list
    this.imageList = [
      {url: 'https://i.ibb.co/wBYDxLq/beach.jpg', title: 'Beach Houses'},
      {url: 'https://i.ibb.co/gM5NNJX/butterfly.jpg', title: 'Butterfly'},
      {url: 'https://i.ibb.co/10fFGkZ/car-race.jpg', title: 'Car Racing'},
      {url: 'https://i.ibb.co/ygqHsHV/coffee-milk.jpg', title: 'Coffee with Milk'},
      {url: 'https://i.ibb.co/7XqwsLw/fox.jpg', title: 'Fox'},
      {url: 'https://i.ibb.co/L1m1NxP/girl.jpg', title: 'Mountain Girl'},
      {url: 'https://i.ibb.co/wc9rSgw/desserts.jpg', title: 'Desserts Table'},
      {url: 'https://i.ibb.co/wdrdpKC/kitten.jpg', title: 'Kitten'},
      {url: 'https://i.ibb.co/dBCHzXQ/paris.jpg', title: 'Paris Eiffel'},
      {url: 'https://i.ibb.co/JKB0KPk/pizza.jpg', title: 'Pizza Time'},
      {url: 'https://i.ibb.co/VYYPZGk/salmon.jpg', title: 'Salmon '}
    ];
    this.imageList.push(base64Images[0]);
    this.imageList.push(base64Images[1]);
    // define the image to start from
    this.startFrom = 2;
  }

  // handle the exit button
  handleExit(ev: { result?: any; imageIndex?: any; message?: any; }){
    console.log(`&&& ev: ${JSON.stringify(ev)}`);
    const keys = Object.keys(ev);
    if(keys.includes('result') &&ev.result) {
      if(keys.includes('imageIndex')) {
        console.log(`last image index: ${ev.imageIndex}`);
      }
    }
    if(keys.includes('message')) {
      console.log(`returned message: ${ev.message}`);
    }
    this.router.navigateByUrl('/home');
  }

}
