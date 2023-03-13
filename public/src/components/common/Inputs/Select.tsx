import React, { useState, useRef, useEffect } from "react";

import { makeStyles } from "@mui/styles";
import { Select, FormControl, MenuItem, Typography, SelectChangeEvent } from "@mui/material";

import styles from "./Select.module.scss";
import { Overrides } from "./SelectStyleOverrides";
import { DropDownProps } from "./types";

const styleOverrides = makeStyles(Overrides);

export const DropDown = ({
  name = "",
  placeholder = "Выберите значение",
  disabled,
  initial,
  titleKey = "title",
  valueKey = "value",
  slim,
  label,
  items = [],
  menu = false,
  onChange = () => null,
}: DropDownProps) => {
  const classes = styleOverrides();
  const wrapper = useRef(null);

  const [selected, setSelected] = useState<string | number>("");

  const changeHandler = (e: SelectChangeEvent<string | number>) => {
    if (menu) {
      onChange(name, e.target.value as string);
      return;
    }
    setSelected(e.target.value as string);
  };

  useEffect(() => {
    onChange(name, selected);
  }, [selected]);

  useEffect(() => {
    if (initial && initial != selected) {
      setSelected(initial);
    }
  }, [initial]);

  return (
    <>
      <div className={styles.Container}>
        {label && <label htmlFor={name}>{label}</label>}
        <div ref={wrapper} className={styles.Wrapper}>
          <FormControl variant="outlined" style={{ width: "100%" }}>
            <Select
              value={selected}
              onChange={changeHandler}
              displayEmpty
              className={[classes.Select, !selected && classes.Dimmed, slim && classes.Slim].join(
                " "
              )}
              IconComponent={() => (
                <div className={styles.Icon}>
                  <img src="svg/chevron.svg" />
                </div>
              )}
              inputProps={{
                disabled,
              }}
              MenuProps={{
                container: wrapper.current,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "left",
                },
                transformOrigin: {
                  vertical: "top",
                  horizontal: "left",
                },
                // getContentAnchorEl: null,
                className: classes.Menu,
              }}
            >
              <MenuItem value={""} className="disabled">
                <Typography variant="inherit" noWrap>
                  {placeholder}
                </Typography>
              </MenuItem>
              {items.map((item) => (
                <MenuItem key={item[valueKey] as string} value={item[valueKey] as string}>
                  <Typography variant="inherit" noWrap>
                    {item[titleKey]}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
    </>
  );
};
