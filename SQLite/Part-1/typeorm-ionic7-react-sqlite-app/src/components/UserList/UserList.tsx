import React from 'react';
import './UserList.css';
import { IonList, IonLabel, IonListHeader,
         IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { User } from '../../databases/entities/user/user';
import { Item } from '../../databases/entities/user/item';

interface UserListProps {
  users: User[] }

const UserList: React.FC<UserListProps> = ({users}) => {

  return (
    <IonList className="UserList">
      <IonListHeader id= "users-ion-list-header">
        <IonLabel>User's List</IonLabel>
      </IonListHeader>
      {users && users.map((user: User) => (
        <IonCard key={user.id}>
          <IonCardHeader>
            <IonCardTitle>{user.firstName} {user.lastName}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
              <ul>
                {user.items && user.items.map((item: Item) => 
                  <li key={`${user.id}-${item.id}}`}>
                    {item.name} {item.phoneNumber}
                  </li>
                )}
              </ul>
          </IonCardContent>
        </IonCard>
      ))}
    </IonList>
  )
};

export default UserList;
