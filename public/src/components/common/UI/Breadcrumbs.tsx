import { Link } from "react-router-dom";
import styles from "./Breadcrumbs.module.scss";

interface Props {
  list: Array<CrumbSchema>;
}

interface CrumbSchema {
  title: string;
  link?: string;
}

const Wrapper = ({ item, children }: { item: CrumbSchema; children: JSX.Element }) => {
  if (item.link) {
    return (
      <Link to={item.link} className={styles.BreadcrumbsItem}>
        {children}
      </Link>
    );
  }
  return (
    <div
      className={[styles.BreadcrumbsItem, styles.BreadcrumbsItemDimmed].join(
        " "
      )}
    >
      {children}
    </div>
  );
};

const Crumb = ({ item }: { item: CrumbSchema }) => {
  return (
    <Wrapper item={item}>
      <span>{item.title}</span>
    </Wrapper>
  );
};

export const Breadcrumbs = ({ list = [] }: Props) => {

  return (
    <div className={styles.Breadcrumbs}>{list.map((item, ind) => <Crumb key={ind} item={item} />)}</div>
  );
};
