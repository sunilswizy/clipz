import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClipzService } from 'src/app/services/clipz.service';
import IClip from 'src/app/model/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  videoOrder = '1';
  uploadedVideos: IClip[] = [];
  activeClip : IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(private router: Router, 
              private clipz: ClipzService,
              private modalService: ModalService,
              private route: ActivatedRoute) 
  {
              this.sort$ = new BehaviorSubject(this.videoOrder);
              this.sort$.subscribe(console.log);
              this.sort$.next('hello')
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
      this.sort$.next(this.videoOrder);
    })

    this.clipz.getAllClips(this.sort$).subscribe((res) => {
      this.uploadedVideos = [];

      res.forEach(item => {
        this.uploadedVideos.push({
          docId: item.id,
          ...item.data()
        })
      })

      console.log(this.uploadedVideos)
    })
  }

  sort(e: Event) {
    const { value } = e.target as HTMLSelectElement;

      this.router.navigateByUrl(`/manage?sort=${value}`)
  }

  openModel(event: Event, clip: IClip) {
    event.preventDefault();
    console.log(clip)
    this.activeClip = clip

    this.modalService.toggleModal('editClip')
  }

  updateData(event: IClip) {
    this.uploadedVideos.forEach((item) => {
      if(item.docId == event.docId) {
        item.title = event.title
      }
    })
  }

  async deleteModel(event: Event, clip: IClip) {
    event.preventDefault();
    
    await this.clipz.deleteClip(clip)

    this.uploadedVideos.forEach((item, index) => {
      if(item.docId == clip.docId) {
        this.uploadedVideos.splice(index, 1)
      }
    })
  }
}
