import { Schema } from "mongoose";

export type Populatable<T> = T | Schema.Types.ObjectId; 
export type ID = Schema.Types.ObjectId;