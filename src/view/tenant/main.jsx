import { Component } from 'react';
import {Layout, Row, Col, Card, Typography, Image, Input } from 'antd'

import post from '@/utils/request'

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
// 导入我们定义的action
import { settenantuser } from '@/redux/tenant/user';
const { Header, Footer, Sider, Content } = Layout;
const { Title } = Typography
const { Search } = Input

// mapStateToProps：将state映射到组件的props中
const mapStateToProps = (state) => {
    return {
        tenantuser: state.tenantuser,
    }
}

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        settenantuser(data) {
            dispatch(settenantuser(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(
    class loginComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {// 组件数据
                bestcost: [],//性价比
                hot: [],//热门
                newest: [],//最新
            }
        }

        componentDidMount() {
            this.getmainhouse()
        }

        getmainhouse = () => {
            post('/tenant/main/gethouse', {}).then(res => {
                this.setState({ ...res })
            })
        }
        onSearch = value => {
            this.props.history.push({ pathname: '/tenant/search', query: { "text": value } })
        }
        render() {
            return (
                <div>
                    <Row justify="center" align="middle" >
                        <Col span={24}>
                            <Header style={{ color: 'white', zIndex: 1, width: '100%', padding: 0 }}>
                                <Row wrap={false} justify="space-between">
                                    <Col flex="auto" style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                                        <Image
                                            height={72}
                                            width={72}
                                            preview={false}
                                            src="/logo/logo512.png"
                                        />
                                        <Title style={{ color: 'white', display: 'inline-block', marginTop: 6 }} level={3}>安居房屋租赁系统</Title>
                                    </Col>
                                    {/* <Col flex="auto" style={{ textAlign: 'right', marginRight: 20 }} >
                                        <Avatar
                                            style={{ backgroundColor: '#87d068', marginRight: 10 }}
                                            src={this.state.userinfo.avatar}
                                        />
                                        <Dropdown overlay={usermenu}>
                                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                                {this.state.userinfo.username} <Icon type='down' />
                                            </a>
                                        </Dropdown>
                                        <Modal title="修改密码" visible={this.state.modify_pass.visible} onOk={this.modifypasshandleOk} onCancel={this.modifypasshandleCancel}>
                                            <Input.Password value={this.state.modify_pass.old} onChange={(e) => { this.changemodifypass({ old: e.target.value }) }} placeholder="旧密码" />
                                            <Input.Password value={this.state.modify_pass.new} onChange={(e) => { this.changemodifypass({ new: e.target.value }) }} placeholder="新密码" />
                                            <Input.Password value={this.state.modify_pass.renew} onChange={(e) => { this.changemodifypass({ renew: e.target.value }) }} placeholder="新密码" />
                                        </Modal>
                                    </Col> */}
                                </Row>
                            </Header>
                        </Col>
                        <Col span={16}>
                            <Row justify="center" align="middle">
                                <Col span={20}>
                                    <Search
                                        placeholder="搜索"
                                        allowClear
                                        enterButton="搜索"
                                        size="large"
                                        style={{ marginTop: 64, marginBottom: 48, width: "100%" }}
                                        onSearch={this.onSearch}
                                    />
                                </Col>
                            </Row>
                            <Row justify="space-between" align="middle" gutter={16}>
                                <Col span={12}>
                                    <Title level={3}>性价比最高</Title>
                                    <Row gutter={16}>
                                        {this.state.bestcost.map(house => {
                                            return (
                                                <Col span={8} height="100vw" key={house.id} style={{ cursor: "pointer" }} onClick={() => {
                                                    this.props.history.push({ pathname: '/tenant/housedetail', query: { "id": house.id } })
                                                }}>
                                                    <Card bodyStyle={{ padding: '0', width: '100%', height: '100%' }}>
                                                        <Image preview={false} width="100%" height={150} src={house.img_list[0].url} />
                                                    </Card>
                                                    <a href="#"><Title
                                                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                                                        level={5}>
                                                        {house.title}
                                                    </Title></a>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Title level={3}>热门房源</Title>
                                    <Row gutter={16}>
                                        {this.state.hot.map(house => {
                                            return (
                                                <Col span={8} height="100vw" key={house.id} style={{ cursor: "pointer" }} onClick={() => {
                                                    this.props.history.push({ pathname: '/tenant/housedetail', query: { "id": house.id } })
                                                }}>
                                                    <Card bodyStyle={{ padding: '0', width: '100%', height: '100%' }}>
                                                        <Image preview={false} width="100%" height={150} src={house.img_list[0].url} />
                                                    </Card>
                                                    <a href="#"><Title
                                                        style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                                                        level={5}>
                                                        {house.title}
                                                    </Title></a>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </Col>
                            </Row>
                            <Row gutter={16} justify="center" align="middle">
                                <Col span={4}>
                                    <Title level={1}>最新<br />发布</Title>
                                </Col>
                                {this.state.newest.map(house => {
                                    return (
                                        <Col span={4} height="100vw" key={house.id} style={{ cursor: "pointer" }} onClick={() => {
                                            this.props.history.push({ pathname: '/tenant/housedetail/' + house.id, query: { "id": house.id } })
                                        }}>
                                            <Card bodyStyle={{ padding: '0', width: '100%', height: '100%' }}>
                                                <Image preview={false} width="100%" height={150} src={house.img_list[0].url} />
                                            </Card>
                                            <a href="#"><Title
                                                style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                                                level={5}>
                                                {house.title}
                                            </Title></a>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Col>
                    </Row>
                </div>
            );
        }
    }
)
