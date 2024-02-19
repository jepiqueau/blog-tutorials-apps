import React from 'react';
import './PostList.css';
import { IonList,IonLabel, IonListHeader, IonCard, IonCardHeader,
         IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/react';
import { Post } from '../../databases/entities/author/post';

interface PostListProps {
  posts: Post[] }

const PostList: React.FC<PostListProps> = ({posts}) => {

  const getCategories = (post: Post) => {
      const categories: string = post.categories.map(cat => cat.name).join(", ");
      return categories;
  }
  return (
    <IonList className="PostList">
      <IonListHeader id= "post-ion-list-header">
        <IonLabel>Post's List</IonLabel>
      </IonListHeader>
      {posts && posts.map((post: Post) => (
        <IonCard key={post.id}>
          <IonCardHeader>
            <IonCardTitle>{post.title}</IonCardTitle>
            <IonCardSubtitle class="post-author-subtitle">{post.author.name}</IonCardSubtitle>
            <IonCardSubtitle class="post-categories-subtitle">{getCategories(post)}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonLabel>{post.text}</IonLabel>
          </IonCardContent>
        </IonCard>
      ))}
    </IonList>
  )
};

export default PostList;
