import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

  videoOrder = '1'

  constructor(private router: Router, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videoOrder = params.sort === '2' ? params.sort : '1';
    })
  }

  sort(e: Event) {
    const { value } = e.target as HTMLSelectElement;

      this.router.navigateByUrl(`/manage?sort=${value}`)
  }
}
