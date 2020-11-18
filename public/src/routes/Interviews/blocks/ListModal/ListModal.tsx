import React from 'react';

import { List } from './blocks';

import styles from './styles.module.scss';

export const ListModal = (props: any) => {
  return (
    <div className={styles.Modal}>
      <div className={styles.Overlay}
        onClick={props.close}
      ></div>
      <div className={styles.Dialog}>
        <List 
          list={props.list}
          bind={props.bind}
        />
      </div>
    </div>
  ) 
}