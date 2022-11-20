import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QuerySnapshot } from '@angular/fire/compat/firestore';
import IClip from '../model/clip.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, map } from 'rxjs/operators';
import { BehaviorSubject, of, combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ClipzService {

  public clipsCollection : AngularFirestoreCollection<IClip>;

  constructor(private db: AngularFirestore, private auth: AngularFireAuth, private store: AngularFireStorage) {
    this.clipsCollection = db.collection('clips')
   }

   createClip(data: IClip) {
      return this.clipsCollection.add(data)
   }

   getAllClips(sort: BehaviorSubject<string>) {
      return combineLatest(
        [this.auth.user, sort]
        ).pipe(
        switchMap((value) => {
          const [user, sort] = value
          if(!user) {
            return of([])
          }

          const query = this.clipsCollection.ref.where(
            "uid", '==', user.uid
          ).orderBy(
            'timestamp',
            sort === '1' ? 'desc' : 'asc'
          )

          return query.get()
        }),
        map((snapshot) => (snapshot as QuerySnapshot<IClip>).docs)
      )
   }

   updateTitle(docId: string, title: string) {
    return this.clipsCollection.ref.doc(`${docId}`).update({title})
   }

   deleteClip(clip: IClip) {
    // this.store.ref(`clipz/`)
    return this.clipsCollection.ref.doc(`${clip.docId}`).delete()
   }
}
