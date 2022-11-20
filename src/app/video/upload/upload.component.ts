import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import {v4 as uuid} from 'uuid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipzService } from 'src/app/services/clipz.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

   isDragOver = false;
   isUploading = false;
   file: File | null = null;
   showForm = false;
   uploadForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)])
  })
  alertColor = 'orange'
  liveCount: number = 0;
  textRender = `video is uploading... ${this.liveCount}% done`;
  user: firebase.User | null = null;
  task ?:AngularFireUploadTask;

  constructor(private storage: AngularFireStorage, 
              private clip: ClipzService,
              private router: Router,
              private auth: AngularFireAuth) {
    auth.user.subscribe(user => {
      this.user = user;
    })
   }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile(event: Event) {
    console.log(event)
    this.isDragOver = false;
    this.file = (event as DragEvent).dataTransfer ? 
    (event as DragEvent).dataTransfer?.files.item(0) ?? null :
    (event.target as HTMLInputElement).files?.item(0) ?? null;
    console.log("file ", this.file)

    if(!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.uploadForm.get('title')?.setValue(this.file.name.replace(/\.[^/.]+$/, ""));
    this.showForm = true;
  }

  async uploadFile() {
    this.uploadForm.disable()
    console.log("File uploaded...")
    this.isUploading = true
    
    let path = `clipz/${uuid()}/${this.file?.name}`;

      this.task = this.storage.upload(path, this.file);

      this.task.percentageChanges()
      .subscribe({
        next: (res: any) => {
          this.liveCount = Math.floor(res);
          this.textRender = `video is uploading... ${this.liveCount}% done`;
          if(this.liveCount === 100) {

          this.storage.ref(path).getDownloadURL().subscribe(async url => {
            const clip = {
              uid: this.user?.uid as string,
              displayName: this.user?.displayName as string,
              title: this.uploadForm.get('title')?.value as string,
              fileName: this.file?.name as string,
              url,
              timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }

            const { id } = await this.clip.createClip(clip);
            this.router.navigate([
              'clip', id
            ])
            console.log({id})
            this.textRender = "video is uploaded succesfully";
            this.alertColor = 'green';
          })
          }
        },
        error: (e: any) => {
          console.log(e.code)
          this.uploadForm.enable()
          if(e.code === 'storage/unauthorized') {
            this.textRender = "Invalid file format or exceeds size, please try again!"
            this.alertColor = 'red'
          }
        }
      })
  }
}
