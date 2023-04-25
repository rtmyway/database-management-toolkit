import React, { PureComponent } from 'react';
import {setLocale, getLocale } from 'umi/locale';
import {Tag, Menu, Icon, Dropdown} from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import styles from './index.less';
import dataConfig from '../../configs/DataConfig';

export default class GlobalHeaderRight extends PureComponent {
  getNoticeData() {
    const { notices = [] } = this.props;
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map(notice => {
      const newNotice = { ...notice };
      if (newNotice.datetime) {
        newNotice.datetime = moment(notice.datetime).fromNow();
      }
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = {
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        }[newNotice.status];
        newNotice.extra = (
          <Tag color={color} style={{ marginRight: 0 }}>
            {newNotice.extra}
          </Tag>
        );
      }
      return newNotice;
    });
    return groupBy(newNotices, 'type');
  }

  changLang = () => {
    const locale = getLocale();
    if (!locale || locale === 'zh-CN') {
      setLocale('en-US');
    } else {
      setLocale('zh-CN');
    }
  };

  render() {
    const {
      onMenuClick,
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <Icon type="logout" />
          退出登录
        </Menu.Item>
      </Menu>
    );
    const noticeData = this.getNoticeData();
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    dataConfig.carryObject.load();
    let operator = dataConfig.carryObject.data.operator;
    return (
      <div className={className}>
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
            <span className={styles.name}>{`${operator.user.realName}(${operator.user.userName})`}</span>
            </span>
          </Dropdown>
      </div>
    );
  }
}
