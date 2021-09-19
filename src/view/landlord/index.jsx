import { Component } from 'react';
import post from '@/utils/request'
import { message } from 'antd';
import { withRouter } from 'react-router-dom'

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
import { setlandlorduser } from '@/redux/landlord/user';
import { Layout, Menu, Row, Col, Dropdown, Typography, Avatar, Modal, Input,Image } from 'antd'
import { Icon } from '@ant-design/compatible';

import { landlordmenu } from '@/routes/landlord'
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Title } = Typography;

const mapStateToProps = (state) => {
    return {
        landlorduser: state.landlorduser,
    }
}

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setlandlorduser(data) {
            dispatch(setlandlorduser(data))
        }
    }
}


class IndexComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {// 组件数据
            userinfo: {
                mobile: "",
                username: "",
                avatar: ""
            },
            modify_pass: {
                visible: false,
                old: "",
                new: '',
                renew: ''
            }
        }
        props.history.listen(() => {
            //监控跳转,更改title
            // console.log(this.props.location)
        })
    }
    componentDidMount() {
        // 挂载 - 检查状态
        this.setState({ userinfo: { ...this.props.landlorduser } })
    }

    handleUserMenuClick = (e) => {
        // logout 注销
        if (e.key === "logout") {
            post('/landlord/logout', {
                auth:this.props.landlorduser.token,
                mobile:this.props.landlorduser.mobile
            }).then((res => {
                this.props.setlandlorduser({})//注销
                message.success("注销成功")
                this.props.history.push('/landlord/login')
            }))
        }
        else {// modifypass 修改密码
            this.changemodifypass({ visible: true })
        }
    }

    changemodifypass(data) {
        let modify_pass = this.state.modify_pass
        let result = Object.assign(modify_pass, data)
        this.setState({ result })
    }

    modifypasshandleOk = () => {
        // 检查
        if (this.state.modify_pass.new !== this.state.modify_pass.renew) {
            message.error("新密码不一致")
            return
        }

        post('/landlord/modify_pass', {
            old: this.state.modify_pass.old,
            new: this.state.modify_pass.new
        }).then((res => {
            message.success("修改成功")
        }))
        this.changemodifypass({ visible: false, old: '', new: '', renew: '' })
    }

    modifypasshandleCancel = () => {
        this.changemodifypass({ visible: false, old: '', new: '', renew: '' })
    }

    render() {
        const usermenu = (
            <Menu onClick={this.handleUserMenuClick}>
                <Menu.Item key="logout">
                    注销
        </Menu.Item>
                <Menu.Item key="modifypass">
                    修改密码
        </Menu.Item>
            </Menu>
        );

        return (
            <Layout style={{ height: '100vh', }}>
                <Header style={{ color: 'white', zIndex: 1, width: '100%', padding: 0 }}>
                    <Row wrap={false} justify="space-between">
                        <Col flex="auto" style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                        <Image
                                height={72}
                                width={72}
                                preview={false}
                                src="/logo/logo512.png"
                            />
                            <Title style={{ color: 'white', display: 'inline-block', marginTop: 6 }} level={3}>安居房屋租赁房东管理系统</Title>
                        </Col>
                        <Col flex="auto" style={{ textAlign: 'right', marginRight: 20 }} >
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
                        </Col>
                    </Row>
                </Header>
                <Layout>
                    <Sider style={{ overflow: 'auto', left: 0, color: 'white' }}
                    >
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            {landlordmenu.map(parents => {
                                if (parents.isShow === false) { return {} }
                                if (parents.children === undefined) {
                                    return (
                                        <Menu.Item key={parents.path} onClick={p => this.props.history.push(`/landlord${p.key}`)}>
                                            <Icon type={parents.icon} />
                                            {parents.title}
                                        </Menu.Item>
                                    )
                                } else {
                                    return (
                                        <SubMenu key={parents.path} title={
                                            <span>
                                                <Icon type={parents.icon} />
                                                <span>{parents.title}</span>
                                            </span>
                                        }>
                                            {parents.children.map((child) => {
                                                return (
                                                    <Menu.Item key={child.path} onClick={p => this.props.history.push(`/landlord${p.key}`)}>
                                                        <Icon type={child.icon} />{child.title}
                                                    </Menu.Item>
                                                )
                                            })}
                                        </SubMenu>
                                    )
                                }
                            })}
                        </Menu>
                    </Sider>
                    <Content style={{ padding: 20 }}>
                        {this.props.children}
                    </Content>
                </Layout>
                {/* <Footer style={{ textAlign: 'center' }}>@copyright 蔡卓晏</Footer> */}
            </Layout>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(IndexComponent))
