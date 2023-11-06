import { useState, useEffect, useRef, useContext } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
        IonButtons, IonBackButton, useIonViewWillEnter, useIonViewWillLeave
      } from '@ionic/react';
import './UsersPage.css';
import UserForm from '../../components/UserForm/UserForm';
import UserList from '../../components/UserList/UserList';
import { User } from '../../models/User';
import { useQuerySQLite } from '../../hooks/UseQuerySQLite';
import { SQLiteDBConnection } from "@capacitor-community/sqlite";
import { platform } from '../../App';
import { SqliteServiceContext, StorageServiceContext } from '../../App';
import { Toast } from '@capacitor/toast';

const UsersPage: React.FC = () => {
  const ref = useRef(false);
  const dbNameRef = useRef('');
  const isInitComplete = useRef(false);
  const [users, setUsers] = useState<User[]>([]);
  const [db, setDb] = useState<SQLiteDBConnection | null>(null);
  const sqliteServ = useContext(SqliteServiceContext);
  const storageServ = useContext(StorageServiceContext);

  const openDatabase = () => {
    try {
      const dbUsersName = storageServ.getDatabaseName();
      dbNameRef.current = dbUsersName;
      const version = storageServ.getDatabaseVersion();

      sqliteServ.openDatabase(dbUsersName, version, false).then((database) => {
        setDb(database);
        ref.current = true;
      });
    } catch (error) {
      const msg = `Error open database:: ${error}`;
      console.error(msg);
      Toast.show({
        text: `${msg}`,
        duration: 'long'
      });           
    }
  }

  const handleAddUser = async (newUser: User) => {
    if (db) {
      // Send the newUser to the addUser storage service method
      const isConn = await sqliteServ.isConnection(dbNameRef.current,false);
      const lastId = await storageServ.addUser(newUser);
      newUser.id = lastId;

      // Update the users state to include the newly added user
      setUsers(prevUsers => [...prevUsers, newUser]);

    }
  };

  const handleUpdateUser = async (updUser: User) => {
    if (db) {
      const isConn = await sqliteServ.isConnection(dbNameRef.current,false);
      await storageServ.updateUserById(updUser.id.toString(),updUser.active);
      // Update the users state with the modified user
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === updUser.id ? { ...user, active: updUser.active } : user
        )
      );
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (db) {
      const isConn = await sqliteServ.isConnection(dbNameRef.current,false);
      await storageServ.deleteUserById(userId.toString());
      // Update the users state by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
   }
  };

  useIonViewWillEnter( () => {
    const initSubscription = storageServ.isInitCompleted.subscribe((value) => {
      isInitComplete.current = value;
      if(isInitComplete.current === true) {
        const dbUsersName = storageServ.getDatabaseName();
        if(ref.current === false) {
          if(platform === "web") {
            customElements.whenDefined('jeep-sqlite').then(() => {
              openDatabase();
            })
            .catch ((error) => {
              const msg = `Error open database:: ${error}`;
              console.log(`msg`);
              Toast.show({
                text: `${msg}`,
                duration: 'long'
              });           
            });

          } else {
            openDatabase();
          }
        }
      }
    });

    return () => {
      initSubscription.unsubscribe();
    };
  }, [storageServ]);

  useIonViewWillLeave(  () => {

      sqliteServ.closeDatabase(dbNameRef.current,false).then(() => {
        ref.current = false;  
      })
      .catch((error) => {
        const msg = `Error close database:: ${error}`;
        console.error(msg);
        Toast.show({
          text: `${msg}`,
          duration: 'long'
        });           
      });
    });
    useEffect(() => {
      // Fetch users from the database using useQuerySQLite hook

      if (isInitComplete.current === true && db) {
        const stmt = 'SELECT * FROM users';
        const values: any[] = [];
        const fetchData =  useQuerySQLite(db, stmt, values);
        fetchData()
        .then((fetchedUserData) => {
          setUsers(fetchedUserData);
        })
        .catch((error) => {
          const msg = `Error fetching user data: ${error}`;
          console.error(msg);
          Toast.show({
            text: `${msg}`,
            duration: 'long'
          });           
        });
      }
    }, [db]);


  return (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Managing Users</IonTitle>
        <IonButtons slot="start">
          <IonBackButton text="home" defaultHref="/home"></IonBackButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      {ref.current && (
        <div>
          <IonCard>
            <h1>Add New User</h1>
            <UserForm onAddUser={handleAddUser} />
          </IonCard>
          <IonCard>
            <h2>Current Users</h2>
            <UserList users={users} onUpdateUser={handleUpdateUser} 
              onDeleteUser={handleDeleteUser}/>
          </IonCard>
        </div>
      )}
    </IonContent>
  </IonPage>
  );
};

export default UsersPage;
