import { Schema } from "mongoose";

export const ForEach = async <T>(array: T[], callback: (entity: T, index?: number) => Promise<void>) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index);
  }
};

export function Sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function RemoveOne(array: Schema.Types.ObjectId[], value: Schema.Types.ObjectId) {
  const match = array.findIndex((element) => element.toString() === value.toString());
  array.splice(match, 1);
}

export function RemoveMany(array: Schema.Types.ObjectId[], value: Schema.Types.ObjectId[]) {
  value.forEach((val) => RemoveOne(array, val));
}
