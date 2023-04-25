import React, {Component } from 'react';
import {Form, Input, Row, Col,Spin, Drawer, Button, Radio, Card, Checkbox, Popover, Select, message, Empty, Tag, } from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
import copy from 'copy-to-clipboard';
import ReactJson from 'react-json-view'
import CheckCommon from '../../../../commons/CheckCommon';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

/**
 * 提供自定义配置
 */
export default class DdmCustomizedInstanceAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      sourceInstanceList: [],

      dataObj : {
        sourceConfig: {
          dbItem: 'oracle',
        },

        targetConfig: {
          dbItem: 'oracle',
          dbConnectionUrl: 'jdbc:oracle:thin:@//host:1521/PDB_NAME',
          dbUser: '',
          dbPassword: '',
        },
        transformConfig: {
          instanceName: '',
          mappingRule: '',
          mappingRuleArray: [],
          isTopicRegular: false,
          topicStr: '',
          useLowerTopic: false,
          useUpperTopic: true,
          useRenameBomTable: false,
        },

        config: {

        },
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {

      this.initConfig(viewObj.data.configObj);


      this.setState({
        sourceInstanceList: viewObj.data.sourceInstanceList
      });
    }
  }

  initConfig = (config) => {
    let sourceConfig = {
      dbItem: 'oracle',
    };
    let targetConfig = {
      dbItem: 'oracle',
      dbConnectionUrl: 'jdbc:oracle:thin:@//host:1521/PDB_NAME',
      dbUser: '',
      dbPassword: '',
    };

    let transformConfig = {
      instanceName: '',
      mappingRule: '',
      mappingRuleArray: [],
      isTopicRegular: false,
      topicStr: '',
      useLowerTopic: false,
      useUpperTopic: true,
      useRenameBomTable: false,
    };


    if (config.hasOwnProperty('origin.source.db')) {
      // sourceConfig
      sourceConfig = {
        dbItem: config['origin.source.db'],
      };

      // targetConfig
      targetConfig = {
        dbItem: config['origin.target.db'],
        dbConnectionUrl: config['connection.url'],
        dbUser: config['connection.user'],
        dbPassword: config['connection.password'],
      };

      // transformConfig
      transformConfig = {
        instanceName: '',
        mappingRule: config['origin.transform.mappingRule'],
        mappingRuleArray: [],
        isTopicRegular: config['origin.transform.isTopicRegular'] == 'true',
        topicStr: config['origin.transform.topicStr'],
        useLowerTopic: false,
        useUpperTopic: true,
        useRenameBomTable: false,
      }
    }

    


    // 附加选项
    if (targetConfig.dbItem == 'oracle') {
      transformConfig.useLowerTopic = false;
      transformConfig.useUpperTopic = true;
      if (sourceConfig.dbItem == 'oracle') {
        transformConfig.useRenameBomTable = false;
      } else {
        transformConfig.useRenameBomTable = true;
      }
    } else if (targetConfig.dbItem == 'postgres') {
      transformConfig.useLowerTopic = true;
      transformConfig.useUpperTopic = false;
      transformConfig.useRenameBomTable = false;
    }


    // 生成迁移表达式
    // 1.解析映射规则
    let mappingRuleArray = this.parseMappingRule(transformConfig.mappingRule);
    transformConfig.mappingRuleArray = mappingRuleArray;

    let tmpObj = {
      sourceConfig: sourceConfig,
      targetConfig: targetConfig,
      transformConfig: transformConfig,
      config: {},
    };
    
    this.setState({
      dataObj: tmpObj,
    });

  }


  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'sourceDbItem') {
      dataObj.sourceConfig.dbItem = e.target.value;
    } else if (item == 'targetDbItem') {
      dataObj.targetConfig.dbItem = e.target.value;
      if (dataObj.targetConfig.dbItem == 'oracle') {
        dataObj.targetConfig.dbConnectionUrl = 'jdbc:oracle:thin:@//host:1521/PDB_NAME';
      } else if (dataObj.targetConfig.dbItem == 'postgres') {
        dataObj.targetConfig.dbConnectionUrl = 'jdbc:postgresql://host:5432/db_name';
      }
    } else if (item == 'targetDbConnectionUrl') {
      dataObj.targetConfig.dbConnectionUrl = e.target.value;
    } else if (item == 'targetDbUser') {
      dataObj.targetConfig.dbUser = e.target.value;
    } else if (item == 'targetDbPassword') {
      dataObj.targetConfig.dbPassword = e.target.value;
    } else if (item == 'useLowerTopic') {
      dataObj.transformConfig.useLowerTopic = e.target.checked;
    } else if (item == 'useUpperTopic') {
      dataObj.transformConfig.useUpperTopic = e.target.checked;
    } else if (item == 'useRenameBomTable') {
      dataObj.transformConfig.useRenameBomTable = e.target.checked;
    } else if (item == 'instanceName') {
      dataObj.transformConfig.instanceName = e.target.value;      
    } else if (item == 'isTopicRegular') {
      dataObj.transformConfig.isTopicRegular = e.target.checked;      
    } else if (item == 'topicStr') {
      dataObj.transformConfig.topicStr = e.target.value;
    } else if (item == 'mappingRule') {
      dataObj.transformConfig.mappingRule = e.target.value;
    }

    // 附加选项
    if (dataObj.targetConfig.dbItem == 'oracle') {
      dataObj.transformConfig.useLowerTopic = false;
      dataObj.transformConfig.useUpperTopic = true;
      if (dataObj.sourceConfig.dbItem == 'oracle') {
        dataObj.transformConfig.useRenameBomTable = false;
      } else {
        dataObj.transformConfig.useRenameBomTable = true;
      }
    } else if (dataObj.targetConfig.dbItem == 'postgres') {
      dataObj.transformConfig.useLowerTopic = true;
      dataObj.transformConfig.useUpperTopic = false;
      dataObj.transformConfig.useRenameBomTable = false;
    }


    // 生成迁移表达式
    // 1.解析映射规则
    let mappingRuleArray = this.parseMappingRule(dataObj.transformConfig.mappingRule);
    dataObj.transformConfig.mappingRuleArray = mappingRuleArray;




    this.setState({dataObj: dataObj});
  }

  parseMappingRule = (ruleStr) => {
    let ruleArray = [];
    if (checkCommon.isEmpty(ruleStr)) {
      return ruleArray;
    }
    let ruleStrArray = ruleStr.replaceAll(' ', '').split(',');
    for (let i = 0; i < ruleStrArray.length; i++) {
      let ruleItem = ruleStrArray[i];
      // 使用:分隔
      let arr = ruleItem.split(':');
      if (arr.length == 2) {
        let fromArr = arr[0].split('|');
        if (fromArr.length == 1) {
          ruleArray.push({from: arr[0], to: arr[1]});
        } else {
          fromArr.forEach(element => {
            ruleArray.push({from: element, to: arr[1]});
          });
        }
      }
    }
    return ruleArray;
  }

  generateConfig = () => {
    let dataObj = this.state.dataObj;
    let config = {
      'tasks.max': '1', // 不显示
      'connector.class': 'com.gantang.ddm.connect.jdbc.JdbcSinkConnector', // 不可编辑
      'connection.url': dataObj.targetConfig.dbConnectionUrl, // 可编辑
      'connection.user': dataObj.targetConfig.dbUser, // 可编辑
      'connection.password': dataObj.targetConfig.dbPassword, // 可编辑
      // -------- 固定参数 start--------
      'insert.mode': 'UPSERT', // 不显示
      'pk.mode': 'RECORD_KEY', // 不显示
      'delete.enabled': 'true', // 不显示
      'quote.sql.identifiers': 'never', // 不显示
      'transforms.extractAfter.field': 'after',
      'key.converter.schemas.enable': 'true',
      'value.converter.schemas.enable': 'true',
      'value.converter': 'org.apache.kafka.connect.json.JsonConverter',
      'key.converter': 'org.apache.kafka.connect.json.JsonConverter', 
      'transforms': 'extractAfter',
      'transforms.extractAfter.type': 'org.apache.kafka.connect.transforms.ExtractField$Value',
      'transforms.extractAfter.field': 'after',     
      // -------- 固定参数 end--------
    };

    // 设置订阅topic表达式
    if (dataObj.transformConfig.isTopicRegular) {
      config['topics.regex'] = dataObj.transformConfig.topicStr;
    } else {
      config['topics'] = dataObj.transformConfig.topicStr;
    }


    // 是否使用 lowerTopic
    if (dataObj.transformConfig.useLowerTopic) {
      const LOWER_TOPIC_KEY = 'lowerTopic';
      config['transforms'] = config['transforms'] + ',' + LOWER_TOPIC_KEY;
      config['transforms.' + LOWER_TOPIC_KEY + '.type'] = 'com.gantang.ddm.connect.transforms.TopicLowerOrUpper';
      config['transforms.' + LOWER_TOPIC_KEY + '.case'] = 'lower';
    }

    // 是否使用 upperTopic
    if (dataObj.transformConfig.useUpperTopic) {
      const UPPER_TOPIC_KEY = 'upperTopic';
      config['transforms'] = config['transforms'] + ',' + UPPER_TOPIC_KEY;
      config['transforms.' + UPPER_TOPIC_KEY + '.type'] = 'com.gantang.ddm.connect.transforms.TopicLowerOrUpper';
      config['transforms.' + UPPER_TOPIC_KEY + '.case'] = 'upper';
    }    

    // 是否使用 renameBomTable
    if (dataObj.transformConfig.useRenameBomTable) {
      const RENAME_BOM_TABLE_KEY = 'renameBomTable';
      config['transforms'] = config['transforms'] + ',' + RENAME_BOM_TABLE_KEY;
      config['transforms.' + RENAME_BOM_TABLE_KEY + '.type'] = 'org.apache.kafka.connect.transforms.RegexRouter';
      config['transforms.' + RENAME_BOM_TABLE_KEY + '.regex'] = '(BOMMGMT.BM_PART_ASSEMBLY)(_.*)';
      config['transforms.' + RENAME_BOM_TABLE_KEY + '.replacement'] = '$1';
    }

    // 获得表达式初段内容(数据源实例名称)
    let firstSector = this.getTopicFirstSector(dataObj.transformConfig.topicStr);
    if (checkCommon.isEmpty(firstSector)) {
      return;
    }
    if (dataObj.transformConfig.useLowerTopic) {
      firstSector = firstSector.toLowerCase();
    } else if (dataObj.transformConfig.useUpperTopic) {
      firstSector = firstSector.toUpperCase();
    }


    // 转换transforms
    let currentRuleArray = dataObj.transformConfig.mappingRuleArray;
    if (currentRuleArray.length == 0) {
      const TOPIC_REGEX_TEMPLATE = '({sourceInstanceName}).(.*)';
      const DEFAULT_TRANSFORMS_NAME = 'renameTopic';
      config['transforms'] = config['transforms'] + ',' + DEFAULT_TRANSFORMS_NAME;
      config['transforms.' + DEFAULT_TRANSFORMS_NAME + '.type'] = 'org.apache.kafka.connect.transforms.RegexRouter';
      config['transforms.' + DEFAULT_TRANSFORMS_NAME + '.regex'] = TOPIC_REGEX_TEMPLATE.replace('{sourceInstanceName}', firstSector);
      config['transforms.' + DEFAULT_TRANSFORMS_NAME + '.replacement'] = '$2';
    } else {
      const TOPIC_REGEX_TEMPLATE = '({sourceInstanceName}).({schemaName}).(.*)';
      for (let i = 0; i < dataObj.transformConfig.mappingRuleArray.length; i++) {
        let currentRule = dataObj.transformConfig.mappingRuleArray[i];
        if (dataObj.transformConfig.useLowerTopic) {
          currentRule.from = currentRule.from.toLowerCase();
          currentRule.to = currentRule.to.toLowerCase();
        } else if (dataObj.transformConfig.useUpperTopic) {
          currentRule.from = currentRule.from.toUpperCase();
          currentRule.to = currentRule.to.toUpperCase();
        }
        config['transforms'] = config['transforms'] + ',' + currentRule.from;
        config['transforms.' + currentRule.from + '.type'] = 'org.apache.kafka.connect.transforms.RegexRouter';
        config['transforms.' + currentRule.from + '.regex'] = TOPIC_REGEX_TEMPLATE.replace('{sourceInstanceName}', firstSector).replace('{schemaName}', currentRule.from);
        config['transforms.' + currentRule.from + '.replacement'] = currentRule.to + '.$3';
      }
    }


    // 原配置
    config['origin.source.db'] = dataObj.sourceConfig.dbItem;
    config['origin.target.db'] = dataObj.targetConfig.dbItem;
    config['origin.transform.topicStr'] = dataObj.transformConfig.topicStr;
    config['origin.transform.isTopicRegular'] = dataObj.transformConfig.isTopicRegular;
    config['origin.transform.mappingRule'] = dataObj.transformConfig.mappingRule;


    let result = {
      name: dataObj.transformConfig.instanceName,
      config: config,
    };
    return result;
  }

  getTopicFirstSector = (topicStr) => {
    // 检查是否为空
    if (CheckCommon.isEmpty(topicStr)) {
      message.error('缺少topic表达式');
      return '';
    }

    // 根据逗号分隔表达式
    let tmpArray = topicStr.replaceAll(' ', '').split(',');


    // 过滤出所有表达式的初段内容
    let firstSectorArray = tmpArray.map((item) => {
      return item.replace(/(.*)\.(.*)\.(.*)/, '$1');
    });

    let finalSectorArray = [...new Set(firstSectorArray)];
    if (finalSectorArray.length != 1) {
      message.error('topic表达式初段必须一致');
      return '';
    }

    return finalSectorArray[0];
  }

  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;
    if (CheckCommon.isEmpty(dataObj.transformConfig.instanceName)) {
      message.warn('实例名称不能为空');
      return;
    }

    dataObj.config = this.generateConfig();

    this.setState({dataObj: dataObj});
    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, 'CONFIRM', dataObj);
  }

  onPreviewHandler = (e) => {
    e.preventDefault();
    // 生成config信息
    let dataObj = this.state.dataObj;
    dataObj.config = this.generateConfig();
    this.setState({dataObj: dataObj});
  }  

  render() {
    // 源数据库
    let sourceDbItem = this.state.dataObj.sourceConfig.dbItem;
    let sourceInstanceDom = this.state.sourceInstanceList.filter((item) => {
      let lastClassName = 'OracleConnector';
      if (sourceDbItem == 'postgres') {
        lastClassName = 'PostgresConnector';
      }
      return item.lastClassName == lastClassName;
    }).map((item) => {
      return <p key={item.name}><Tag key={'tag-' + item.name}>{item.name}</Tag><a key={'a-' + item.name} onClick={()=>{copy(item.name);}}>复制</a></p>;
    });


    // 目标数据库
    let dbConnectUrlPlaceholder = '';
    let targetDbItem = this.state.dataObj.targetConfig.dbItem;

    if (targetDbItem == 'oracle') {
      dbConnectUrlPlaceholder = 'jdbc:oracle:thin:@//{host}:{port}/PDB_NAME';
    } else if (targetDbItem == 'postgres') {
      dbConnectUrlPlaceholder = 'jdbc:postgresql://{host}:{port}/db_name';
    }


    let formBodyDom = <div>
      <Card title="源数据库" size="small">
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          <Radio.Group onChange={(e)=>this.onInputHandle('sourceDbItem', e)} value={this.state.dataObj.sourceConfig.dbItem}>
            <Radio value={'oracle'}>oracle</Radio>
            <Radio value={'postgres'}>postgres</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="参考">
          <Popover trigger="hover" content={sourceInstanceDom} title={'数据源实例参考'}>
            <a>{'数据源实例参考'}</a>
          </Popover>
        </FormItem>


      </Card>

      <Card title="目标数据库" size="small" style={{marginTop: '20px'}}>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="类型">
          <Radio.Group onChange={(e)=>this.onInputHandle('targetDbItem', e)} value={this.state.dataObj.targetConfig.dbItem}>
            <Radio value={'oracle'}>oracle</Radio>
            <Radio value={'postgres'}>postgres</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="连接串">
          <Input placeholder={dbConnectUrlPlaceholder} onChange={(e)=>this.onInputHandle('targetDbConnectionUrl', e)} value={this.state.dataObj.targetConfig.dbConnectionUrl} />
        </FormItem>   
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名/密码">
              <Input placeholder="请输入用户名" onChange={(e)=>this.onInputHandle('targetDbUser', e)} value={this.state.dataObj.targetConfig.dbUser} />
              <Input placeholder="请输入密码" onChange={(e)=>this.onInputHandle('targetDbPassword', e)} value={this.state.dataObj.targetConfig.dbPassword} />
            </FormItem>                 
      </Card>

      <Card title="主题配置" size="small" style={{marginTop: '20px'}}>
        
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实例名称">
          <Input placeholder="请输入实例名称" onChange={(e)=>this.onInputHandle('instanceName', e)} value={this.state.dataObj.transformConfig.instanceName} />
        </FormItem>      

        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="topic表达式">
          <Col span={19}><TextArea style={{marginTop: '10px'}} rows={6} placeholder="请输入topic表达式" onChange={(e)=>this.onInputHandle('topicStr', e)} value={this.state.dataObj.transformConfig.topicStr}/></Col>
          <Col span={4} offset={1}><Checkbox key='isTopicRegular' onChange={(e)=>this.onInputHandle('isTopicRegular', e)} checked={this.state.dataObj.transformConfig.isTopicRegular}>正则</Checkbox></Col>
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="schema映射">
          <Input placeholder="例 A1:B1,A2|A3:B2" onChange={(e)=>this.onInputHandle('mappingRule', e)} value={this.state.dataObj.transformConfig.mappingRule} />
        </FormItem>                     
        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="附加选项">
          <Checkbox disabled key='useLowerTopic' onChange={(e)=>this.onInputHandle('useLowerTopic', e)} checked={this.state.dataObj.transformConfig.useLowerTopic}>lowerTopic</Checkbox>    
          <Checkbox disabled key='useUpperTopic' onChange={(e)=>this.onInputHandle('useUpperTopic', e)} checked={this.state.dataObj.transformConfig.useUpperTopic}>upperTopic</Checkbox>    
          <Checkbox disabled key='useRenameBomTable' onChange={(e)=>this.onInputHandle('useRenameBomTable', e)} checked={this.state.dataObj.transformConfig.useRenameBomTable}>renameBomTable</Checkbox> 
        </FormItem> */}
      </Card>           
  </div>

    return (
      <div>
        <Drawer
          title={this.props.viewObj.title}
          placement={'right'}
          width={1000}
          maskClosable={true}
          mask={true}
          onClose={()=>{
            this.props.viewObj.onSubViewVisibleHandler(this.props.viewObj.key, false, {});
          }}
          visible={this.props.viewObj.visible}>
          <Spin spinning={this.props.viewObj.spinning}>
            {formBodyDom}
            <Row gutter={24}>
              <Col span={24}>
                <Popover trigger="click" content={<ReactJson style={{width: '800px'}} displayDataTypes={false} name={false} src={this.state.dataObj.config}/>} title={'预览配置'}>
                  <Button style={{marginTop:'20px', marginLeft:'0px'}} type="default"  onClick={this.onPreviewHandler}>预览</Button>
                </Popover>
                <Button style={{marginTop:'20px', marginLeft:'30px'}} type="primary" onClick={this.onConfirmHandler}>确认</Button>
              </Col>
            </Row>
          </Spin>
        </Drawer>
      </div>
    );
  }
}
