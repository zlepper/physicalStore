import {IPost} from './post';

export interface IList {
  id: string;
  name: string;
  owner: string;
}

export interface IFullList extends IList {
  posts: IPost[]
}
