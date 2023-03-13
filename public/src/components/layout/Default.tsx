import { useSelector } from "react-redux";

import { LayoutProps } from "./types";

import styles from "./Default.module.scss";

const Layout = ({ menu, main }: LayoutProps) => {
  return (
    <>
      <div
        className={[styles.AppLayout, styles.PageWrapper, "container"].join(
          " "
        )}
      >
        <div
          className={[
            styles.AppBody,
            styles.Grid,
          ].join(" ")}
        >
          <div className={styles.AppContent}>{main}</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
