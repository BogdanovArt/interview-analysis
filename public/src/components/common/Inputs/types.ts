import { MutableRefObject } from "react";
import { IBasicObject } from "types/index";

export enum InputTypes {
  checkbox = "input-checkbox",
  switchbox = "input-switchbox",
  text = "input-text",
  date = "input-date-picker",
  time = "input-time-picker",
  select = "input-select",
  async = "input-async"
}
export type EventTypes = "manual" | "auto" | undefined;
export type onChange<T> = (name: string, value?: T, type?: EventTypes) => void;

interface InputBase<ReturnType = string> {
  name?: string;
  initial?: ReturnType;
  disabled?: boolean;
  referrence?: MutableRefObject<HTMLInputElement>;
  label?: string;
  onChange?: onChange<ReturnType>;
}

export interface TextInputProps extends InputBase {
  placeholder?: string;
  before?: JSX.Element;
  after?: JSX.Element;
  emptyValue?: string;
  dimmed?: boolean;
  centered?: boolean;
  allowedCharacters?: string;
  onEnter?: onChange<string>;
  onBlur?: onChange<string>;
  onFocus?: onChange<string>;
}

export interface DatePickerProps extends InputBase {}

export interface TimePickerProps extends InputBase {
  step?: number;
}

export interface DropDownItem<R> {
  title: string;
  value: R;
}

export interface DropDownProps extends InputBase<string | number> {
  placeholder?: string;
  titleKey?: string;
  valueKey?: string;
  slim?: boolean;
  menu?: boolean;
  items: IBasicObject[];
}

export interface AsyncInputProps extends InputBase<IBasicObject[]> {
  placeholder?: string;
  visibleKeys?: string[];
  request?: (pl: unknown) => Promise<any>;
}

export interface CheckBoxProps extends InputBase<boolean> {
  big?: boolean;
  reverse?: boolean;
}

export interface SwitchBoxProps extends InputBase<boolean> {
  reverse?: boolean;
}

export interface NumberInputProps extends InputBase<number> {
    dimmed?: boolean;
    step?: number;
    width?: number | "auto";
    max?: number;
    min?: number;
}

export interface InputBlock {
  type: InputTypes;
  options: InputItem;
}

export type InputItem =
  | TextInputProps
  | DatePickerProps
  | TimePickerProps
  | DropDownProps
  | AsyncInputProps
  | SwitchBoxProps
  | NumberInputProps
  | CheckBoxProps;
