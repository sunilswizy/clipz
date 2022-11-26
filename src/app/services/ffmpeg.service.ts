import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {

  isLoaded = true;
  isRunning = false;
  private ffmpeg;

  constructor() { 
    this.ffmpeg = createFFmpeg({
      log: true
    });

  }

  async init() {
    if(!this.isLoaded) {
      return
    }

    await this.ffmpeg.load()
    this.isLoaded = false;
  }

  async getScreenShots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);

    this.ffmpeg.FS('writeFile', file.name, data);

    const seconds = [2, 4, 6];
    const commands: string[] = [];

    seconds.forEach((second => {
        commands.push(
          '-i', file.name,
          '-ss', `00:00:0${second}`,
          '-frames:v', '1',
          '-filter:v', 'scale=510:-1',
          `output_0${second}.png`
        )
    }));

    await this.ffmpeg.run(
      ...commands
    );

    const screenShotArray: string[] = []

    seconds.forEach((second => {

      const screenShot = this.ffmpeg.FS('readFile', `output_0${second}.png`);

      const blob = new Blob(
        [screenShot.buffer], {
          type: 'image/png'
        }
      );


      screenShotArray.push(URL.createObjectURL(blob))
    }));  

    this.isRunning = false;

    return screenShotArray;

  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return blob;
  }
}
