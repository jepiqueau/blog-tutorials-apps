import { Injectable } from '@angular/core';
import { Filesystem, Directory, StatOptions } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

export interface Video {
  id: number;
  device: string;
  type: string;
  title: string;
  url: string;
  thumb?: string;
  note: string;
  subtitle?: string;
  stlang?: string;
}


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private videos: Video[] = [
    {
      id: 1,
      type: "mp4",
      device: "all",
      url: "https://brenopolanski.github.io/html5-video-webvtt-example/MIB2.mp4",
      note: "Breno Polanski",
      title: "Test MP4 with Subtitle",
      subtitle: "https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt",
      stlang: "es"
    },
    {
      id: 2,
      type: "mp4",
      device: "all",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      note: "By Blender Foundation",
      thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
      title: "Big Buck Bunny"
    },
    {
      id: 3,
      type: "mp4",
      device: "all",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      note: "By Blender Foundation",
      thumb: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
      title: "Elephant Dream"
    },
    {
      id: 4,
      type: "mp4",
      device: "all",
      url: "https://media.bernat.ch/videos/2019-self-hosted-videos-subtitles/progressive.mp4",
      note: "Blender Animation Studio",
      thumb: "https://d2pzklc15kok91.cloudfront.net/images/posters/2019-self-hosted-videos-subtitles.3b55d44c736235.jpg",
      title: "327",
      subtitle: "https://media.bernat.ch/videos/2019-self-hosted-videos-subtitles.en.vtt",
      stlang: "en"
    },
    {
      id: 5,
      type: "aws",
      device: "all",
      url: "https://universo-dev-a-m.s3.amazonaws.com/779970/fe774806dbe7ad042c24ce522b7b46594f16c66e",
      note: "Custom",
      title: "AWS video test",
    },
    {
      id: 6,
      type: "hls",
      device: "all",
      url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      note: "By Blender Foundation",
      title: "Big Buck Bunny",
    },
    {
      id: 7,
      type: "mpd",
      device: "android",
      url: "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd",
      note: "",
      title: "MPD video test",
    },
    {
      id: 8,
      type: "webm",
      device: "android",
      url: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Sintel_movie_4K.webm",
      note: "Blender Foundation",
      thumb: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Sintel_movie_4K.webm/800px--Sintel_movie_4K.webm.jpg?20150505130125",
      title: "Webm video test",
    },
    {
      id: 9,
      type: "mp4",
      device: "android",
      url: "public/assets/video/Bike720.mp4",
      note: "",
      title: "Video from Assets directory",
    },
    {
      id: 10,
      type: "mp4",
      device: "android",
      url: "file:///storage/emulated/0/Documents/Bike720.mp4",
      note: "",
      title: "Video on Documents directory",
    },
    {
      id: 11,
      type: "mp4",
      device: "android",
      url: "file:///sdcard/Download/Bike720.mp4",
      note: "",
      title: "Video on sdcard Download directory",
    },
    {
      id: 12,
      type: "mp4",
      device: "android",
      url: "file:///sdcard/DCIM/Camera/Bike720.mp4",
      note: "",
      title: "Video on sdcard DCIM directory",
    },
    {
      id: 13,
      type: "mp4",
      device: "android",
      url: "file:///sdcard/Documents/KSSV/documents/1/videos/2-12-2023-101222.mp4",
      note: "",
      title: "Video on sdcard issue#142 directory",
    },
    {
      id: 14,
      type: "mp4",
      device: "ios",
      url: "public/assets/video/Bike720.mp4",
      note: "",
      title: "Video from Assets directory",
    },
    {
      id: 15,
      type: "mp4",
      device: "ios",
      url: "file:///var/mobile/Containers/Data/Application/22A433FD-D82D-4989-8BE6-9FC49DEA20BB/Documents/Bike720.mp4",
      note: "",
      title: "Video on App's Documents directory",
    },
    {
      id: 16,
      type: "mp4",
      device: "ios",
      url: "file:///var/mobile/Documents/Bike720.mp4",
      note: "",
      title: "Video on Documents directory",
    },
    {
      id: 17,
      type: "mp4",
      device: "ios",
      url: "file:///var/mobile/Downloads/Bike720.mp4",
      note: "",
      title: "Video on Download directory",
    },
    {
      id: 18,
      type: "mp4",
      device: "ios",
      url: "file:///var/mobile/Media/DCIM/100APPLE/Bike720.mp4",
      note: "",
      title: "Video on Media/DCIM directory",
    },
    {
      id: 19,
      type: "mp4",
      device: "all",
      url: "https://raw.githubusercontent.com/jepiqueau/jepiqueau.github.io/master/videos/Bike720.mp4",
      note: "Test Bike720",
      title: "Video from ",
    },


];

  constructor() {
    this.createDeviceVideo();
  }


  public getVideos(platform: string): Video[] {
    if (platform === 'web') {
      // Filter videos for Web platform (device: 'all')
      return this.videos.filter((video) => video.device === 'all');
    } else if (platform === 'android') {
      // Filter videos for Android platform (device: 'all' or 'android')
      return this.videos.filter((video) => video.device === 'all' || video.device === 'android');
    } else if (platform === 'ios') {
      // Filter videos for iOS platform (device: 'all' or 'ios')
      return this.videos.filter((video) => video.device === 'all' || video.device === 'ios');
    } else {
      return [];
    }
  }
  public getVideoById(id: number): Video | undefined {
    return this.videos.find(video => video.id === id);
  }
  private async createDeviceVideo(): Promise<void> {
    const platform = Capacitor.getPlatform();
    if (['ios', 'android'].includes(platform)) {
      // file Bike720.mp4
      const urlBike = "https://raw.githubusercontent.com/jepiqueau/jepiqueau.github.io/master/videos/Bike720.mp4";

      const uri = await this.fetchingVideoToDevice(urlBike, Directory.Documents);
      console.log(`###### uri : ${uri} ######`)
      if(uri !== undefined) {
        await this.copyVideoToOthersDirectories(uri,platform);
      }
      // test with a given path
      const vUri = await this.fetchingVideoToDevice(urlBike, Directory.Documents,"KSSV/documents/1/videos/2-12-2023-101222.mp4" );
      console.log(`###### vUri : ${vUri} ######`)

    }
  }

  public async fetchingVideoToDevice(url:string, directory: Directory, path: string = ""): Promise<string | undefined> {
    const urlName = path.length === 0 ? this.getFileName(url)! : path;
    const isVideoExists = await this.isFileExists(urlName, directory);
    if(!isVideoExists) {
      let response = await fetch(url);
      let dbBlob = await response.blob();
      let vBase64 = await this.getBlobAsBase64(dbBlob);
      await Filesystem.writeFile({ data: vBase64, path: urlName, recursive: true, directory: directory });
      return (await Filesystem.getUri({
        path: urlName,
        directory: Directory.Documents
      })).uri;

    } else {
      return (await Filesystem.getUri({
        path: urlName,
        directory: Directory.Documents
      })).uri;
    }

  }
  private getBlobAsBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, _) => {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.readAsDataURL(blob);
    });
  }

  private async copyVideoToOthersDirectories(uri: string,platform: string): Promise<void> {
    // Copy a video to others local device's directory

    const uriName = this.getFileName(uri);
    let toPathDocum: string = "";
    let toPathDownl: string = "";
    let toPathDCIM: string = "";
    if (platform === 'ios') {
      const containersIndex = uri.indexOf('Containers');
      const folderPath = containersIndex !== -1 ? uri.substring(0, containersIndex) : uri;
      toPathDocum = `${folderPath}Documents/${uriName!}`;
      toPathDownl = `${folderPath}Downloads/${uriName!}`;
      toPathDCIM = `${folderPath}Media/DCIM/100APPLE/${uriName!}`;
    } else if (platform === 'android') {
      const parentPathIndex = uri.indexOf('Documents');
      const parentPath = parentPathIndex !== -1 ? uri.substring(0, parentPathIndex) : uri;
      toPathDownl = `${parentPath}Download/${uriName!}`;
      toPathDCIM = `${parentPath}DCIM/Camera/${uriName!}`;
    }

    if(toPathDocum.length > 0 && !(await this.isFileExists(toPathDocum))) {
      const rc1 = await Filesystem.copy ({
        from: uri,
        to: toPathDocum
      });
    }
    if(toPathDownl.length > 0 && !(await this.isFileExists(toPathDownl))) {
      const rc2 = await Filesystem.copy ({
        from: uri,
        to: toPathDownl
      });
    }
    if(toPathDCIM.length > 0 && !(await this.isFileExists(toPathDCIM))) {
      const rc3 = await Filesystem.copy ({
        from: uri,
        to: toPathDCIM
      });
    }
  }

  private async isFileExists(path: string, directory?: Directory): Promise<boolean> {

    try {
      const options: StatOptions = {} as StatOptions;
      options.path = path;
      const dir = directory ? directory : "";
      if (dir.length > 0) options.directory = directory;
      const info = await Filesystem.stat(options);
      console.log(`&&&&& info: ${JSON.stringify(info)} &&&&&`)
      return true;
    } catch (error) {
      return false;
    }
  }
  private getFileName(url: string) : string | undefined{
    const urlObject = new URL(url);
     return urlObject.pathname.split('/').pop();
  }
}
