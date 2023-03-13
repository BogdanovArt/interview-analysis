import { fontStyles } from "assets/scss/consts";

export const Overrides = {
  Select: {
    height: 45,
    "& .MuiSelect-select:focus": {
      backgroundColor: "transparent",
    },
    "& .MuiSelect-outlined": {
      padding: "10px 15px",
      paddingRight: "35px",
      color: "var(--text-color)",
      ...fontStyles,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--border-color)",
    },
    "&.Mui-focused": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--accent-color)",
        borderWidth: 1,
      },
    },
    "&:hover": {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--border-hover)",
      },
    },
  },
  Dimmed: {    
    "& .MuiSelect-outlined": {
      color: "var(--hint-color)",
      opacity: 0.4,
    },
  },
  Slim: {
    height: 20,
    marginLeft: -15,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "transparent !important",
    },
  },
  Menu: {
    marginTop: 10,
    maxWidth: 0,
    "& .MuiPaper-root": {
      border: "1px solid var(--border-color)",
      color: "var(--text-color)",
      backgroundColor: "var(--bg-primary)",
      boxShadow: "var(--shadow-primary)",
    },
    "& .MuiListItem-root": {
      ...fontStyles,
      "&:hover": {
        backgroundColor: "var(--bg-secondary)",
      },
      "&.Mui-selected": {
        backgroundColor: "transparent",
        color: "var(--accent-color) !important",
      },
      "&.disabled": {
        display: "none",
      },
    },
  },
};
