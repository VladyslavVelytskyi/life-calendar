import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-birth-form',
  templateUrl: './birth-form.component.html',
  styleUrls: ['./birth-form.component.css']
})
export class BirthFormComponent implements OnInit {
  birthday: string;

  constructor() {
    this.birthday = '';
  }

  submitBirthForm(e) {
    e.preventDefault();
    console.log(this.birthday);
  }

  ngOnInit() {
  }

}
