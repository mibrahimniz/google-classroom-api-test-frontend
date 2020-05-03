import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../models/ngx-datatables/page';
import {TeacherModel} from '../models/teacher.model';
import {StudentModel} from '../models/student.model';
import {ClassroomService} from '../services/classroom.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  page = new Page();
  teacherRows = [];
  studentRows = [];
  isLoading = false;
  teachers = [];
  students = [];
  courseTitle: string;

  constructor(private router: Router, private classroomService: ClassroomService) {
    this.page.pageNumber = 0;
    this.page.size = 10;
   }

  ngOnInit() {
    this.setPage({ offset: 0});
  }

  setPage(pageInfo) {
    this.courseTitle = localStorage.getItem('courseTitle');
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    const courseId = localStorage.getItem('courseId');
    this.classroomService.getPeople(courseId).subscribe(resp => {
      const teacher = new TeacherModel();
      const student = new StudentModel();
      // tslint:disable-next-line:forin
      // tslint:disable-next-line:curly
      // tslint:disable-next-line:no-string-literal
      for (let i = 0; i < resp['teachers'].length; i++) {
        // tslint:disable-next-line:no-string-literal
        teacher.setValues(resp['teachers'][i].profile.name.fullName);
        // tslint:disable-next-line:no-string-literal
        student.setValues(resp['students'][i].profile.name.fullName);
        this.teachers.push(teacher);
        this.students.push(student);
        i++;
      }
      this.page.totalElements = this.teachers.length;
      this.page.totalPages = this.teachers.length / this.page.size;
      this.teacherRows = this.teachers;
      this.studentRows = this.students;
      this.isLoading = false;
    },
    error => {
      console.log(error);
    });
  }
}
