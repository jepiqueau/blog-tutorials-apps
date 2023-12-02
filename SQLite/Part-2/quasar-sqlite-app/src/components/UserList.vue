<template>
  <q-list>
    <q-item v-for="user in users" :key="user.id">
      <q-item-section side middle>
        <q-checkbox
          :model-value="userActiveState(user)"
          dense
          @click="handleCheckboxClick(user)"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label> {{ user.id }} - {{ user.name }} </q-item-label>
        <!-- <q-item-label> {{ user.email }} </q-item-label> // version 2 -->
      </q-item-section>
      <q-item-section side middle>
        <q-btn
          dense
          flat
          icon="edit"
          color="positive"
          @click="handleEditClick(user)"
        />
      </q-item-section>

      <!-- Delete Button with Trash Icon -->
      <q-item-section side middle>
        <q-btn
          dense
          flat
          icon="delete"
          color="negative"
          @click="handleDeleteClick(user.id)"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { User } from '../models/User';

export default defineComponent({
  name: 'UserList',
  props: {
    users: Array as () => User[],
    onUpdateUserActive: Function,
    onDeleteUser: Function,
    onEditUser: Function,
  },
  setup(props) {
    const userActiveState = (user: User) => {
      // Convert user.active to boolean
      return user.active === 1;
    };
    const handleCheckboxClick = (user: User) => {
      // Create a new user object with the updated active value
      const updatedUser = { ...user, active: user.active === 1 ? 0 : 1 };
      if (typeof props.onUpdateUserActive === 'function') {
        props.onUpdateUserActive(updatedUser);
      }
    };
    const handleDeleteClick = (userId: number) => {
      if (typeof props.onDeleteUser === 'function') {
        props.onDeleteUser(userId);
      }
    };
    const handleEditClick = (user: User) => {
      if (typeof props.onEditUser === 'function') {
        props.onEditUser(user);
      }
    };

    return {
      userActiveState,
      handleCheckboxClick,
      handleDeleteClick,
      handleEditClick,
    };
  },
});
</script>
