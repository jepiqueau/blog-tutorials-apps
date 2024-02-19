import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
        IonButtons, IonBackButton, IonIcon, useIonViewWillEnter} from '@ionic/react';
import './UsersPage.css';
import { save } from 'ionicons/icons';

import sqliteParams from '../databases/sqliteParams';

import userDataSource from '../databases/datasources/UserDataSource';
import { User } from '../databases/entities/user/user';
import { Item } from '../databases/entities/user/item';
import UserList from '../components/UserList/UserList';
import { getCountOfElements } from '../databases/utilities';

const UsersPage: React.FC = () => {
    const [initialRef, setInitialRef] = useState(false);
    const [isWeb, setIsWeb] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    let errMess = '';

    const connection = userDataSource.dataSource;
    const database = userDataSource.dbName;

    const devices: string[] = ['Iphone 13', 'Samsung Galaxy S20 FE', 'Samsung GalaxyS23', 
                               'Iphone 14 Pro', 'XIAOMI Redmi 12'];

    const selectRandomDevice = (devices: string[]): string => {
        const randomIndex = Math.floor(Math.random() * devices.length);
        
        // Return the device at the random index
        return devices[randomIndex];
    };
    const generateRandomNumber = ((): number => {
        let randomNumber = '';
        for (let i = 0; i < 9; i++) {
          randomNumber += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
        }
        return Number(randomNumber);
    });
    
    const createUser = async (firstName:string, lastName:string, email:string): Promise<User> => {
        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        const userRepository = connection.getRepository(User);
        let userToUpdate = await userRepository.findOne({
          where: {
            email: user.email,
          },
        });
        if (userToUpdate != null) {
          user.id = userToUpdate.id;
        }
        await userRepository.save(user);
        return user;
    };
    const createItem = async (name: string, phoneNumber: number, user:User): Promise<void> => {

        const item = new Item();
        item.name = name;
        item.phoneNumber = phoneNumber;
        item.user = user;
        const itemRepository = connection.getRepository(Item);
        let itemToUpdate = await itemRepository.findOne({
          where: {
            phoneNumber: item.phoneNumber,
          },
        });
        if (itemToUpdate != null) {
          item.id = itemToUpdate.id;
        }
        await itemRepository.save(item);
        return ;
    };

    const initializeUsers = async () => {
        try {
            setIsWeb(sqliteParams.platform === 'web' ? true : false);
            const countUser = await getCountOfElements(connection, User);
            if (countUser === 0 ) {
                const user1 = await createUser('Arthur','Ashe', 'arthur.ashe@example.com');
                const user2 = await createUser('John','Smith','john.smith@example.com');
                await createItem(selectRandomDevice(devices),
                                generateRandomNumber(),user1)
                await createItem(selectRandomDevice(devices),
                                generateRandomNumber(),user1)
                await createItem(selectRandomDevice(devices),
                                generateRandomNumber(),user2)

                if (sqliteParams.platform === 'web'&& typeof database === 'string') {        
                    await sqliteParams.connection.saveToStore(database);
                }
            }
            setItems(await connection.manager.find(Item));
            setUsers(await connection
                .createQueryBuilder(User, 'user')
                .innerJoinAndSelect('user.items', 'item')
                .orderBy('user.lastName,item.name')
                .getMany());
    
        } catch (e) {
            console.log((e as any).message);
            errMess = `Error: ${(e as any).message}`;
        }               
    };
    const handleSave = (async () => {
        await sqliteParams.connection.saveToStore(database);
        // write database to local disk for development only
        await sqliteParams.connection.saveToLocalDisk(database);

    });

    useIonViewWillEnter(() => {
        if(initialRef === false) {
            initializeUsers();
            setInitialRef(true);
          }
    
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                <IonTitle>Users DB</IonTitle>
                <IonButtons slot="start">
                    <IonBackButton text="home" defaultHref="/home"></IonBackButton>
                </IonButtons>
                {isWeb && (
                    <IonButtons slot="end">
                        <IonIcon icon={save} onClick={handleSave}></IonIcon>
                    </IonButtons>
                )}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {initialRef && (
                    <div>
                        <IonCard v-if="errMess.length > 0">
                            <p>{errMess}</p>
                        </IonCard>
                        <div id="userlist-container">
                            <UserList users={users}/>
                        </div>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
      
} 
export default UsersPage;
