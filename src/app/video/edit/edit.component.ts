import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/model/clip.model';
import { ClipzService } from 'src/app/services/clipz.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {

  @Input() activeClip : IClip | null = null;;
  showAlert = false;
  alertMsg = 'please wait updating...';
  alertColor = 'blue';
  inSubmission = false;
  editForm !: FormGroup;
  title!: FormControl;
  @Output() update = new EventEmitter<IClip>();


  constructor(private modalService: ModalService, private clipz: ClipzService) { }

  ngOnInit(): void {
    console.log(this.activeClip)
    this.modalService.register('editClip');
    this.title = new FormControl(this.activeClip?.title, Validators.required);

    this.editForm = new FormGroup({
      title: this.title
    });
  }

  ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes.activeClip) {
      return;
    }
    this.inSubmission = false;
    this.showAlert = false;
    
    this.title.setValue(changes.activeClip.currentValue.title);
  }

  async updateTitle() {

    if(!this.activeClip) {
      return;
    }

    this.inSubmission = true;
    this.showAlert = true;
    await this.clipz.updateTitle(this.activeClip?.docId as string , this.title.value);
    this.activeClip.title = this.title.value;
    this.update.emit(this.activeClip);
    this.alertMsg = 'Title updated successfully!';
  }

}
