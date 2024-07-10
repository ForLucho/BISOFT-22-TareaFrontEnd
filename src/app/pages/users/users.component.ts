import { Component } from '@angular/core';
import { UserListComponent } from '../../components/user/user-list/user-list.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    UserListComponent,
    LoaderComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
