import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PhotoViewer, Image, ViewerOptions,
  capShowOptions, capShowResult} from '@capacitor-community/photoviewer';
import { Capacitor } from '@capacitor/core';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-photoviewer',
  templateUrl: './photoviewer.component.html',
  styleUrls: ['./photoviewer.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
 })
export class PhotoviewerComponent  implements OnInit {
  @Input() imageList: Image[] = [];
  @Input() mode = '';
  @Input() startFrom = 0;
  @Output() pvExit: EventEmitter<any> = new EventEmitter();

  platform: string;
  options: ViewerOptions = {} as ViewerOptions;
  pvPlugin: any;

  constructor() {
    this.platform = Capacitor.getPlatform();
    this.pvPlugin = PhotoViewer;
  }

  async ngOnInit() {
    // define the show method
    const show = async (imageList: Image[], mode: string,
        startFrom: number,options?: ViewerOptions): Promise<capShowResult> => {
      const opt: capShowOptions = {} as capShowOptions;
      opt.images = imageList;
      opt.mode = mode;
      if( mode === 'one' || mode === 'slider') {
        opt.startFrom = startFrom;
      }
      if(options) {
        opt.options = options;
      }
      try {
        const ret = await this.pvPlugin.show(opt);
        if(ret.result) {
            return Promise.resolve(ret);
        } else {
            return Promise.reject(ret.message);
        }
      } catch (err: any) {
        const ret: capShowResult = {} as capShowResult;
        ret.result = false;
        ret.message = err.message ? err.message : err;
        return Promise.reject(ret.message);
      }
    };
    // Define the showToast method
    const showToast = async (message: string) => {
      await Toast.show({
        text: message,
        position: 'center',
        duration: 'long'
      });
    };

    // add listener 'jeepCapPhotoViewerExit'
    this.pvPlugin.addListener('jeepCapPhotoViewerExit',
        (e: any) => {
          console.log(`in'jeepCapPhotoViewerExit' e: ${JSON.stringify(e)} `)
      this.pvExit.emit(e);
    });

    // main process
    try {
      // ****************************************************
      // here you defined the value for the different options
      // ****************************************************
      // uncomment the following desired lines below
      // this.options.title = false;
      // this.options.share = false;
      // this.options.transformer = "depth";
      // this.options.spancount = 2
      this.options.maxzoomscale = 3;
      this.options.compressionquality = 0.6;
      this.options.backgroundcolor = 'white';
      this.options.movieoptions = {mode: 'portrait', imagetime: 3};
      if (this.imageList != null && this.imageList.length > 0) {
        const result = await show(this.imageList, this.mode, this.startFrom, this.options);
        // base64 images call
        //ret = await show(base64List, options);
        if(!result.result) {
          const message = result.message
                  ? result.message
                  : "No message return"
          await showToast(message);
          this.pvExit.emit({result: result.result, message: message});
        }
        if(result.result && Object.keys(result).includes('message')) {
          const message = result.message
                  ? result.message
                  : "No message return"
          await showToast(message);
          this.pvExit.emit({result: result.result, message: message});
        }
      }
    } catch (err: any) {
      const msg = err.message ? err.message : err
      await showToast(msg);
      this.pvExit.emit({result: false, message: msg});
    }
  }
}
