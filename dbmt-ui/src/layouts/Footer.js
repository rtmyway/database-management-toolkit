import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import versionConfig from '../configs/VersionConfig';
const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" />{versionConfig.companyName}<span style={{marginLeft:'20px'}}>{versionConfig.versionNo}</span>
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
