import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../models/ngx-datatables/page';
import {CourseModel} from '../models/course.model';
import {ClassroomService} from '../services/classroom.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  page = new Page();
  rows = [];
  isLoading = false;
  data = [];

  constructor(private router: Router, private classroomService: ClassroomService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
   }

  ngOnInit() {
    const fullUrl = this.router.url;
    const authCode = fullUrl.slice(11, 102);
    const decodedCode = decodeURIComponent(authCode);
    this.setPage({ offset: 0}, decodedCode);
  }
  setPage(pageInfo, decodedCode) {
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.classroomService.getAllCourses(decodedCode).subscribe(pagedData => {
      // tslint:disable-next-line:forin
      for (const i in pagedData) {
        const course = new CourseModel();
        course.initialize(pagedData[i].id, pagedData[i].name);
        this.classroomService.getPeople(pagedData[i].id).subscribe(people => {
          // tslint:disable-next-line:no-string-literal
          course.setValues(people['students'].length, people['teachers'].length);
        },
        error => {
          console.log(error);
        });
        this.data.push(course);
      }
      this.page.totalElements = this.data.length;
      this.page.totalPages = this.data.length / this.page.size;
      this.rows = this.data;
      this.isLoading = false;

    },
    error => {
      console.log(error);
    });
  }
  getId(value: string) {
    // tslint:disable-next-line:forin
    for (const i in this.data) {
      if (this.data[i].title === value) {
        localStorage.setItem('courseId', this.data[i].id);
        localStorage.setItem('courseTitle', value);
      }
    }
  }

}
