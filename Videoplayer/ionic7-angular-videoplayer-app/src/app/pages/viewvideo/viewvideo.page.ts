import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { DataService, Video} from '../../services/data.service';

@Component({
  selector: 'app-viewvideo',
  templateUrl: './viewvideo.page.html',
  styleUrls: ['./viewvideo.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ViewvideoPage implements OnInit, AfterViewInit {
  private data = inject(DataService);
  private videoIndex: number = 0;
  private videoPlayer: any;
  private platform: string = 'web';
  private video: Video | undefined = {} as Video;

  private handlerPlay: any;
  private handlerPause: any;
  private handlerEnded: any;
  private handlerReady: any;
  private handlerExit: any;

  constructor(private route: ActivatedRoute,
    private navRoute: Router) { }

  //***********************************
  // Component Lifecycle hook methods *
  //***********************************

  ngOnInit() {
    // Subscribe to the params observable to read the id parameter
    this.route.params.subscribe(params => {
      // Extract the 'id' parameter from the route
      this.videoIndex = +params['id'];
    });
  }

  async ngAfterViewInit() {
    // Get the selected video
    this.video = this.data.getVideoById(this.videoIndex);
    // Define the platform and the video player
    const info = await Device.getInfo();
    this.platform = info.platform;
    this.videoPlayer = CapacitorVideoPlayer;

    // add plugin listeners
    await this.addListenersToPlayerPlugin();
    const props: any = {};

    // Initialize the video player
    if (this.video!.url != null) {
      props.mode = "fullscreen";
      props.url = this.video!.url;
      props.playerId = 'fullscreen';
      props.componentTag = 'app-viewvideo';
      if(this.video!.subtitle != null) props.subtitle = this.video!.subtitle;
      if(this.video!.stlang != null) props.stlang = this.video!.stlang;
      const res: any = await this.videoPlayer.initPlayer(props);
    }

  }

  async ngOnDestroy(): Promise<void> {
    // Remove the plugin listeners
    await this.handlerPlay.remove();
    await this.handlerPause.remove();
    await this.handlerEnded.remove();
    await this.handlerReady.remove();
    await this.handlerExit.remove();
    await this.videoPlayer.stopAllPlayers();
    return;
  }

  // *******************
  // Private Functions *
  // *******************

  // Define the plugin listeners
  private async addListenersToPlayerPlugin(): Promise<void> {
    this.handlerPlay = await this.videoPlayer.addListener('jeepCapVideoPlayerPlay',
      (data: any) => {
        const fromPlayerId = data.fromPlayerId;
        const currentTime = data.currentTime;
        console.log(`<<<< onPlay in ViewerVideo ${fromPlayerId} ct: ${currentTime}`);
      }, false);
    this.handlerPause = await this.videoPlayer.addListener('jeepCapVideoPlayerPause',
      (data: any) => {
        const fromPlayerId = data.fromPlayerId;
        const currentTime = data.currentTime;
        console.log(`<<<< onPause in ViewerVideo ${fromPlayerId} ct: ${currentTime}`);
      }, false);
    this.handlerEnded = await this.videoPlayer.addListener('jeepCapVideoPlayerEnded',
      (data: any) => {
        const fromPlayerId = data.fromPlayerId;
        const currentTime = data.currentTime;
        console.log(`<<<< onEnded in ViewerVideo ${fromPlayerId} ct: ${currentTime}`);
        this.playerLeave();
      }, false);
    this.handlerExit = await this.videoPlayer.addListener('jeepCapVideoPlayerExit',
      (data: any) => {
        const dismiss = data.dismiss ;
        console.log(`<<<< onExit in ViewerVideo ${dismiss}`);
        this.playerLeave();
      }, false);
    this.handlerReady = await this.videoPlayer.addListener('jeepCapVideoPlayerReady',
      (data: any) => {
        const fromPlayerId = data.fromPlayerId;
        const currentTime = data.currentTime;
        console.log(`<<<< onReady in ViewerVideo ${fromPlayerId} ct: ${currentTime}`);
      }, false);
    return;
  }

  // Action when the player ended or exit
  private playerLeave() {
    this.navRoute.navigate(['/home']);
    return;
  }

}
