import { Kindergarden } from "./Kindergarden";

export interface Child {
    id: string;
    name: string;
    birthDate: string,
    entryDate: string,
    kindergardenId: number
  }

  export interface ChildResponse {
    id: string;
    name: string;
    birthDate: string,
    entryDate: string,
    kindergarden: Kindergarden,
    kindergardenId: number
    [key: string]: any;
  }