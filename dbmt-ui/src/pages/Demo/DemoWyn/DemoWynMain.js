import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, Badge} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../DemoGlobal.less';
import DemoGlobalConstants from '../DemoGlobalConstants';

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DemoWynMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],              
    };
  }

  //render前执行
  componentWillMount() {
    
  }

  componentDidMount(){

  }

   

 


  render() {


    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      
    </PageHeaderWrapper>
    );
  }
}





