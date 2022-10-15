import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css']
})
export class ClipComponent implements OnInit {
  id = ''

  constructor(private route: ActivatedRoute) {
     this.route.params.subscribe(({id}) => {
      this.id = id;
     })
   }

  ngOnInit(): void {
  }

}
