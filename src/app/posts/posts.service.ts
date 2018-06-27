import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Post } from './post.model';

@Injectable({providedIn: 'root'})  // It provides this on the root level
                                   // Angular finds it
                                   // Only creates one instance of the service fot he entire app
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    // return [...this.posts];  // We copy the array so that we don't change the original one. This happends with [...arrayToBeCopied]
    this.http
      .get<{message: string, posts: any, maxPosts: number}>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(map((postData) => {
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }),
        maxPosts: postData.maxPosts
        };
      }))
      .subscribe(transformedPostData => {
        this.posts = transformedPostData.posts; // We don't need to duplicate because we can't change it in the server
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();  // returns an object to which we can listen but not emit
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(
      'http://localhost:3000/api/posts/' + id
    );
  }


  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title );
    this.http
      .post<{ message: string, post: Post }>(
        'http://localhost:3000/api/posts',
        postData)
      .subscribe(responseData => {
        this.router.navigate(['/']); // We navigate to post-create-component and ngOnInit() gets the posts
      });   // Nothing will happen if we don't subscribe
  }


  updatePost( id: string, title: string, content: string, image: File | string ) {
    let postData: Post | FormData;
    // const post: Post = { id: id, title: title, content: content, imagePath: null};
    if (typeof(image) === 'object') {   // If the img is a file we create a formData object
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData  = {  // If the img is a string we send normal json data
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
    .put('http://localhost:3000/api/posts/' + id, postData)
    .subscribe(response => {
      this.router.navigate(['/']); // We navigate to post-create-component and ngOnInit() fetches the posts
    });
  }

  deletePost(postId: string) {
    return this.http
    .delete('http://localhost:3000/api/posts/' + postId);
  }
}
