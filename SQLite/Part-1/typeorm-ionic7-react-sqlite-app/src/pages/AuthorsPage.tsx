import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard,
        IonButtons, IonBackButton, IonIcon, useIonViewWillEnter } from '@ionic/react';
import './AuthorsPage.css';
import { save } from 'ionicons/icons';

import sqliteParams from '../databases/sqliteParams';
import authorDataSource from '../databases/datasources/AuthorDataSource';
import { Post } from '../databases/entities/author/post';
import { Category } from '../databases/entities/author/category';
import { Author } from '../databases/entities/author/author';
import { getCountOfElements } from '../databases/utilities';
import PostList from '../components/PostList/PostList';

const AuthorsPage: React.FC = () => {
    const [initialRef, setInitialRef] = useState(false);
    const [isWeb, setIsWeb] = useState(false);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    let errMess = '';

    const connection = authorDataSource.dataSource;
    const database = authorDataSource.dbName;

    const createAuthor = async (name:string, email:string): Promise<Author> => {
        const author = new Author();
        author.name = name;
        author.email = email;
        const authorRepository = connection.getRepository(Author);
        let authorToUpdate = await authorRepository.findOne({
            where: {
            email: author.email,
            },
        });
        if (authorToUpdate != null) {
            author.id = authorToUpdate.id;
        }
        await authorRepository.save(author);
        return author;
    }; 
    const createCategory = async (name: string): Promise<Category> => {
        const category = new Category();
        category.name = name;
        const categoryRepository = connection.getRepository(Category);
        let categoryToUpdate = await categoryRepository.findOne({
          where: {
            name: category.name,
          },
        });
        if (categoryToUpdate != null) {
            category.id = categoryToUpdate.id;
        }
        await categoryRepository.save(category);
        return category;
    }; 
    const createPost = async (title: string, text: string, author:Author,
                              categories: Category[]): Promise<void> => {

        const post = new Post();
        post.title = title;
        post.text = text;
        post.author = author;
        post.categories = categories;
        const postRepository = connection.getRepository(Post);
        let postToUpdate = await postRepository.findOne({
          where: {
            title: post.title,
          },
        });
        if (postToUpdate != null) {
            post.id = postToUpdate.id;
        }
        await postRepository.save(post);
        return ;
    }; 
    const initializePosts = async () => {
        try {
            setIsWeb(sqliteParams.platform === 'web' ? true : false);
            const countAuthor = await getCountOfElements(connection, Author);
            if (countAuthor === 0 ) {
                // Create some Authors
                const author1 = await createAuthor('JeepQ', 'jeepq@example.com');
                const author2 = await createAuthor('Rosenwasser', 'rosenwasser@example.com');
                // Create some Categories
                const categ1 = await createCategory('Typescript');
                const categ2 = await createCategory('Programming');
                const categ3 = await createCategory('Tutorial');
                // Create some Posts
                await createPost('Announcing TypeScript 5.0',
                'This release brings many new features, while aiming to make TypeScript smaller, simpler, and faster...',
                author2,[categ1,categ2])
                await createPost('Ionic 7 SQLite Database CRUD App Example Tutorial using Angular and @capacitor-community/sqlite',
                'In that tutorial we will learned how to create a Ionic7/Angular basic CRUD application and implement the @capacitor-community/sqlite plugin to store the data in a SQLite database...',
                author1,[categ1,categ2,categ3])
                await createPost('Ionic 7 VideoPlayer App Example Tutorial using Angular and capacitor-video-player plugin',
                'In this tutorial, we will learn how to create a simple Ionic7/Angular video player application by implementing the capacitor-video-player plugin to display a list of videos with some data and play a selected video in fullscreen mode...',
                author1,[categ1,categ2,categ3])
                if (isWeb) {        
                    await sqliteParams.connection.saveToStore(database);
                }
            }
            setAuthors(await connection.manager.find(Author));
            setCategories(await connection.manager.find(Category));
            setPosts(await connection
                    .createQueryBuilder(Post,'post')
            .innerJoinAndSelect('post.author', 'author')
            .innerJoinAndSelect('post.categories', 'categories')
            .orderBy('author.name,post.title')
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

    useIonViewWillEnter( () => {
        if(initialRef === false) {
            initializePosts();
            setInitialRef(true);
          }

    });

    return (
        <IonPage className="AuthorPage">
            <IonHeader>
                <IonToolbar>
                <IonTitle>Authors DB</IonTitle>
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
                            <PostList posts={posts}/>
                        </div>
                    </div>
                )}
            </IonContent>
        </IonPage>
    );
      
} 
export default AuthorsPage;
