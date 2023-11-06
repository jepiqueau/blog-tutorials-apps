import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule} from '@angular/forms';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  imports: [CommonModule, IonicModule, FormsModule],
  standalone: true,
})
export class UsersComponent  implements OnInit {
  newUserName = ''
  userList: User[] = []
  isWeb: any

  constructor(private storage: StorageService) {}

  ngOnInit() {
     try {
         this.storage.userState().pipe(
             switchMap(res => {
             if (res) {
                 return this.storage.fetchUsers();
             } else {
                 return of([]); // Return an empty array when res is false
             }
             })
         ).subscribe(data => {
             this.userList = data; // Update the user list when the data changes
         });

      } catch(err) {
      throw new Error(`Error: ${err}`);
      }
  }
  async createUser() {
      await this.storage.addUser(this.newUserName)
      this.newUserName = ''
      console.log(this.userList, '#users')
  }

  updateUser(user: User) {
      const active = user.active === 0 ? 1 : 0
      this.storage.updateUserById(user.id.toString(), active)
  }

  deleteUser(user: User) {
      this.storage.deleteUserById(user.id.toString())
  }
}
