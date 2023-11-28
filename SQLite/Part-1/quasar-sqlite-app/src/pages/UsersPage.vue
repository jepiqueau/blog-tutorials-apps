<template>
  <q-page>
    <div v-if="isInitComplete && dbInitialized">
      <q-card>
        <q-card-section>
          <div class="text-h5">Add New User</div>
          <user-form method="add" :onAddUser="handleAddUser"></user-form>
        </q-card-section>
      </q-card>
      <q-card>
        <q-card-section>
          <div class="text-h5">Current Users</div>
          <user-list
            :users="users"
            :onUpdateUserActive="handleUpdateUserActive"
            :onDeleteUser="handleDeleteUser"
            :onEditUser="handleEditUser"
          />
        </q-card-section>
      </q-card>
      <!-- q-dialog for the centered inline modal content -->
      <q-dialog v-model="centeredModalOpen">
        <q-card style="width: 60vw">
          <q-card-section>
            <!-- Modal content goes here -->
            <div class="text-h5">Update User</div>
            <user-form
              method="update"
              :onUpdateUser="handleUpdateUser"
              :user="editUser"
            ></user-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  inject,
  computed,
  onMounted,
  onBeforeUnmount,
  watch,
} from 'vue';
import UserForm from 'components/UserForm.vue';
import UserList from 'components/UserList.vue';
import { User } from '../models/User';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Toast } from '@capacitor/toast';
import { useQuerySQLite } from '../hooks/UseQuerySQLite';
import SQLiteService from 'src/services/sqliteService';
import StorageService from 'src/services/storageService';

export default defineComponent({
  name: 'UsersPage',
  components: { UserForm, UserList },
  setup() {
    // Inject services
    const sqliteServ: SQLiteService | undefined = inject('sqliteServ');
    const storageServ: StorageService | undefined = inject('storageServ');
    // Define Internal variables
    const centeredModalOpen = ref(false);
    const centeredModalMarginTop = ref('20vh');
    const db = ref<SQLiteDBConnection | undefined>(undefined);
    const dbInitialized = computed(() => !!db.value);
    const dbNameRef = ref('');
    const editUser = ref<User>({} as User);
    const isInitComplete = ref(false);
    const isDatabase = ref(false);
    const platform = sqliteServ?.getPlatform();
    const users = ref<User[]>([]);

    // Define methods
    const getAllUsers = async (db: SQLiteDBConnection) => {
      // Query the database to get all users
      const stmt = 'SELECT * FROM users';
      const values: never[] = [];
      const fetchData = await useQuerySQLite(db, stmt, values);
      users.value = fetchData;
    };

    const openDatabase = async () => {
      // Open the connection to the database
      try {
        const dbUsersName = storageServ?.getDatabaseName() as string;
        dbNameRef.value = dbUsersName as string;
        const version = storageServ?.getDatabaseVersion() as number;

        const database = await sqliteServ?.openDatabase(
          dbUsersName,
          version,
          false
        );
        db.value = database;
        isDatabase.value = true;
      } catch (error) {
        const msg = `Error open database: ${error}`;
        console.error(msg);
        Toast.show({
          text: msg,
          duration: 'long',
        });
      }
    };

    const handleAddUser = async (newUser: User) => {
      // Store the new user in the database
      if (db.value) {
        const isConn = await sqliteServ?.isConnection(dbNameRef.value, false);
        if (!isConn) {
          const msg = 'Error handleAddUser: No DatabaseConnection';
          console.error(msg);
          Toast.show({
            text: msg,
            duration: 'long',
          });
        }
        const lastId = await storageServ?.addUser(newUser);
        newUser.id = lastId as number;
        users.value.push(newUser as never);
      }
    };

    const handleUpdateUser = async (updateUser: User) => {
      // Store the updated user data in the database
      if (db.value) {
        const isConn = await sqliteServ?.isConnection(dbNameRef.value, false);
        if (!isConn) {
          const msg = 'Error handleAddUser: No DatabaseConnection';
          console.error(msg);
          Toast.show({
            text: msg,
            duration: 'long',
          });
        }
        await storageServ?.replaceUser(updateUser);
        users.value = users.value.map((user) => {
          if (user.id === updateUser.id) {
            return { ...updateUser };
          } else {
            return user;
          }
        });
        console.log('handleUpdateUser users: ', JSON.stringify(users));
        centeredModalOpen.value = false;
      }
    };

    const handleUpdateUserActive = async (updUser: User) => {
      // Store the updated user's active field in the database
      if (db.value) {
        const isConn = await sqliteServ?.isConnection(dbNameRef.value, false);
        if (!isConn) {
          const msg = 'Error handleUpdateUser: No DatabaseConnection';
          console.error(msg);
          Toast.show({
            text: msg,
            duration: 'long',
          });
        }
        await storageServ?.updateUserActiveById(
          updUser.id.toString(),
          updUser.active
        );
        users.value = users.value.map((user: User) => {
          if (user.id === updUser.id) {
            // Clone the user and update the active property
            return { ...user, active: updUser.active };
          } else {
            return user;
          }
        });
      }
    };

    const handleDeleteUser = async (userId: number) => {
      // Delete a user from the database by using the id field
      if (db.value) {
        const isConn = await sqliteServ?.isConnection(dbNameRef.value, false);
        if (!isConn) {
          const msg = 'Error handleDeleteUser: No DatabaseConnection';
          console.error(msg);
          Toast.show({
            text: msg,
            duration: 'long',
          });
        }
        await storageServ?.deleteUserById(userId.toString());
        users.value = users.value.filter(
          (user) => (user as User).id !== userId
        );
      }
    };

    const handleEditUser = (user: User) => {
      // Get the user to update and open the modal edit form
      editUser.value = user;
      centeredModalOpen.value = true;
    };

    onMounted(() => {
      storageServ?.isInitCompleted.subscribe(async (value: boolean) => {
        isInitComplete.value = value;
        // Open the connection to the database
        if (isInitComplete.value === true) {
          if (platform === 'web') {
            // Web Plaform
            customElements
              .whenDefined('jeep-sqlite')
              .then(async () => {
                await openDatabase();
              })
              .catch((error) => {
                const msg = `Error open database: ${error}`;
                console.log(msg);
                Toast.show({
                  text: msg,
                  duration: 'long',
                });
              });
          } else {
            // Native Platforms
            await openDatabase();
          }
        }
      });
    });

    onBeforeUnmount(() => {
      // Close the connection to the database
      sqliteServ
        ?.closeDatabase(dbNameRef.value, false)
        .then(() => {
          isDatabase.value = false;
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((error: any) => {
          const msg = `Error close database:
                      ${error.message ? error.message : error}`;
          console.error(msg);
          Toast.show({
            text: msg,
            duration: 'long',
          });
        });
    });

    watch(isDatabase, (newIsDatabase) => {
      if (newIsDatabase) {
        // Get all users from the database
        getAllUsers(db.value as SQLiteDBConnection)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .catch((error: any) => {
            const msg = `close database:
                          ${error.message ? error.message : error}`;
            console.error(msg);
            Toast.show({
              text: msg,
              duration: 'long',
            });
          });
      } else {
        const msg = 'newDb is null';
        console.error(msg);
        Toast.show({
          text: msg,
          duration: 'long',
        });
      }
    });

    return {
      centeredModalMarginTop,
      centeredModalOpen,
      dbInitialized,
      editUser,
      isInitComplete,
      users,
      handleAddUser,
      handleDeleteUser,
      handleEditUser,
      handleUpdateUser,
      handleUpdateUserActive,
    };
  },
});
</script>
