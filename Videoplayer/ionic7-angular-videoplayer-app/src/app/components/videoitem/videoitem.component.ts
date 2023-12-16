import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonItem, IonLabel, IonIcon, IonAvatar, IonButton, IonNote } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playCircleOutline } from 'ionicons/icons';
import { Video } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videoitem',
  templateUrl: './videoitem.component.html',
  styleUrls: ['./videoitem.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, RouterLink, IonItem, IonLabel, IonIcon,
            IonAvatar, IonButton, IonNote],
})
export class VideoitemComponent implements OnInit {
  @Input() video?: Video;

  constructor(private route: Router) {
        addIcons({ playCircleOutline });
   }

  ngOnInit() {
    if (!this.video!.hasOwnProperty('thumb')) {
      this.video!.thumb = 'https://avatars3.githubusercontent.com/u/16580653?v=4';
    }
    console.log(`***** in ngOnInit id: ${this.video!.id} video title: ${this.video!.title}`)
  }


  async play() {

    console.log(`***** id: ${this.video!.id}, video title: ${this.video!.title}`)
    this.route.navigate([`/viewvideo/${this.video!.id}`]);
  }
}
