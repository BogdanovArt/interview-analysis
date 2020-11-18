import React from 'react';

import styles from './styles.module.scss';

export const List = (props: any) => {
  return (
    <div className={styles.List}>
      <h4>Выберите интервью</h4>
      {props.list.map((el: any, ind: number) => {
        return (
          <div
            key={ind}
            className={styles.Element}
            onClick={() => props.bind(el._id)}
          >
            <span className={styles.Title}>{el.title}</span>
            <span className={styles.Date}>{el.created}</span>
          </div>
        )
      })}
    </div>
  ) 
}