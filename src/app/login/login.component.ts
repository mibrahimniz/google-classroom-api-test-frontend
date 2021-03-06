import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ClassroomService} from '../services/classroom.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private classroomService: ClassroomService
  ) { }

  ngOnInit() {
  }

  login() {
    this.loading = true;
    this.classroomService.getAuthCode().subscribe(
      data => {
        const resp = JSON.stringify(data);
        const authUrl = JSON.parse(resp);
        console.log('Current URL:   ' + this.router.url);
        // tslint:disable-next-line:no-string-literal
        window.location.href = authUrl['authUrl'];
        this.location.go('/home');
      },
      error => {
        console.log('In Error');
        this.loading = false;
        console.log(error);
      });
  }
}
