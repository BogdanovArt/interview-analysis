import { useState, useEffect } from "react";

import { onChange } from "./types";
import { IBasicObject } from "types/index";

import { CheckBox } from "./CheckBox";


import styles from "./DaysCheck.module.scss";

interface Props {
  name?: string;
  initial?: Array<string | number>;
  disabled?: boolean;
  vertical?: boolean;
  style?: IBasicObject;
  onChange?: onChange<any>;
}

export const DaysGroup = ({
  name,
  style,
  disabled,
  initial = [],
  onChange = () => null,
}: Props) => {
  const [mon, setMon] = useState(false);
  const [tue, setTue] = useState(false);
  const [wen, setWen] = useState(false);
  const [thu, setThu] = useState(false);
  const [fri, setFri] = useState(false);
  const [sat, setSat] = useState(false);
  const [sun, setSun] = useState(false);

  const aggregator = {
    1: setMon,
    2: setTue,
    3: setWen,
    4: setThu,
    5: setFri,
    6: setSat,
    7: setSun
  }

  const prepareValues = () => {
    const payload: number[] = [];
    [mon, tue, wen, thu, fri, sat, sun].forEach((day, index) => {
      if (day) payload.push(index + 1);
    });
    return payload;
  };

  const payload = prepareValues();

  useEffect(() => {
    onChange(name, payload);
  }, [mon, tue, wen, thu, fri, sat, sun]);

  useEffect(() => {
    for (let i = 0; i < 7; i++) {
      (aggregator as any)[i + 1](initial.includes(i + 1));
    }
  }, [initial]);

  return (
    <div
      className={[styles.Row, disabled && styles.Disabled].join(" ")}
      style={style}
    >
      <CheckBox
        name="1"
        disabled={disabled}
        initial={mon}
        label="Пн"
        reverse
        onChange={(name, value) => setMon(value)}
      />

      <CheckBox
        name="2"
        disabled={disabled}
        initial={tue}
        label="Вт"
        reverse
        onChange={(name, value) => setTue(value)}
      />
      <CheckBox
        name="3"
        disabled={disabled}
        initial={wen}
        label="Ср"
        reverse
        onChange={(name, value) => setWen(value)}
      />
      <CheckBox
        name="4"
        disabled={disabled}
        initial={thu}
        label="Чт"
        reverse
        onChange={(name, value) => setThu(value)}
      />
      <CheckBox
        name="5"
        disabled={disabled}
        initial={fri}
        label="Пт"
        reverse
        onChange={(name, value) => setFri(value)}
      />
      <CheckBox
        name="6"
        disabled={disabled}
        initial={sat}
        label="Сб"
        reverse
        onChange={(name, value) => setSat(value)}
      />
      <CheckBox
        name="7"
        disabled={disabled}
        initial={sun}
        label="Вс"
        reverse
        onChange={(name, value) => setSun(value)}
      />
    </div>
  );
};
