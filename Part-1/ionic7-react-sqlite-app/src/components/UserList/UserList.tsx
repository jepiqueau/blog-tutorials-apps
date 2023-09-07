import { FC } from 'react';
import './UserList.css';
import { IonList, IonItem, IonCheckbox, IonButton, IonIcon, IonLabel } from '@ionic/react';
import { User } from '../../models/User';
import { trash } from 'ionicons/icons'; // Import the trash icon

interface UserListProps {
  users: User[],
  onUpdateUser: (user: User) => void;
  onDeleteUser: (userId: number) => void; }

const UserList: FC<UserListProps> = ({users, onUpdateUser, onDeleteUser}) => {
  const handleCheckboxChange = (user: User) => {
    // Create a new user object with the updated active value
    const updatedUser = { ...user, active: user.active === 1 ? 0 : 1 };
    onUpdateUser(updatedUser);
  };

  return (
    <IonList className="UserList">
      {users.map((user: User) => (
          <IonItem key={user.id}>
            <IonCheckbox
              slot="start"
              aria-label=""
              checked={user.active === 1}
              onIonChange={() => handleCheckboxChange(user)}
            ></IonCheckbox>
              {user.id} - {user.name}
            <IonButton
            slot="end"
            fill="clear"
            color="danger"
            onClick={() => onDeleteUser(user.id)}
            >
              <IonIcon icon={trash} />
            </IonButton>
          </IonItem>
      ))}
    </IonList>
  )
};

export default UserList;
