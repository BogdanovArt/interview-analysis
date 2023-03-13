export type IBasicValue = string | number | undefined | boolean | null;

export interface IBasicObject {
  [key: string]: IBasicValue | IBasicValue[] | IBasicObject | IBasicObject[];
}

