import {
  Component,
  OnInit
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../user';
import {HttpService} from '../http.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})

export class RegisterFormComponent implements OnInit {

  constructor(private httpService: HttpService) {

  }

  submit(form: NgForm) {
    const user = new User(form.value);

    return this.httpService.setNewUser(user);
  }

  ngOnInit() {
  }

}


