import ReactDOM from "react-dom";

export function Portal({ children, id = "portal" }: any) {
  const root = document.getElementById(id);
  return root ? ReactDOM.createPortal(children, root) : null;
};

