import React from 'react';
import { Avatar, List ,Skeleton} from 'antd';
import classNames from 'classnames';
import styles from './NoticeList.less';
import moment from "moment";

export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  loading,
  locale,
  emptyText,
  emptyImage,
  onViewMore = null,
  showClear = true,
  showViewMore = false,
}) {
  console.log('notice data result ',data)
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item/*, {
            [styles.read]: item.read,
          }*/);
          // eslint-disable-next-line no-nested-ternary
          // const leftIcon = item.avatar ? (
          //   typeof item.avatar === 'string' ? (
          //     <Avatar className={styles.avatar} src={item.avatar} />
          //   ) : (
          //     <span className={styles.iconElement}>{item.avatar}</span>
          //   )
          // ) : null;

          return (
            <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
              <Skeleton avatar title={false} loading={loading} active>
              <List.Item.Meta
                className={styles.meta}
                // avatar={leftIcon}
                title={
                  <div className={styles.title}>
                    {item.title}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.message}>
                      {item.message}
                    </div>
                    <div className={styles.datetime}>{moment(item.createTime).format('YYYY-MM-DD HH:mm')}</div>

                  </div>
                }
              />
              </Skeleton>
            </List.Item>
          );
        })}
      </List>
      {
        (showClear || showViewMore) && <div className={styles.bottomBar} >
          {showClear ? (
            <div onClick={onClear}>
              {locale.clear} {locale[title] || title}
            </div>
          ) : null}
          {showViewMore ? <div onClick={onViewMore}>{locale.viewMore}</div> : null}
        </div>
      }
    </div>
  );
}
