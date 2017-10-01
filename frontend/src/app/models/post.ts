export interface IPost {
  id: string;
  name: string;
  attachments: IAttachment[];
  creator: string;
}

export interface IAttachment {
  id: string;
  filename: string;
  isImage: boolean;
  uploader: string;
}
