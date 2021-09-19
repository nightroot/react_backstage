import { Component } from 'react';
import { Row, Col, Form, Input, Button ,message} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import post from '@/utils/request'

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
// 导入我们定义的action
import { setbackstageuser } from '@/redux/backstage/user';

// mapStateToProps：将state映射到组件的props中
const mapStateToProps = (state) => {
    return {
        backstageuser: state.backstageuser,
    }
}

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setbackstageuser(data) {
            dispatch(setbackstageuser(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(
    class loginComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {// 组件数据
                mobile: "15730042144",
                pass: "",
                smstext: "发送验证码",
                smscount: 0,
                smsstatus: false
            }
        }
        
        componentWillUnmount(){
            this.setState = ()=>false;
        }

        render() {
            const sendSms = (values) => {
                // 发送验证码
                post('/backstage/sendsms', { mobile: this.state.mobile }).then(res => {
                    if (res.status) {
                        message.success("发送成功")
                        this.setState({ smscount: 60, smsstatus: true })
                        // 自动计数一分钟不能发送
                        this.timer = setInterval(() => {
                            this.setState({ smstext: `请 ${this.state.smscount}s 后再发送`, smscount: this.state.smscount - 1 })
                            if (this.state.smscount === 0) {
                                clearInterval(this.timer);
                                this.setState({ smstext: `发送验证码`, smscount: 0, smsstatus: false })
                            }
                        }, 1000);
                    }
                })
            }

            const login = (values) => {
                // 登录
                post('/backstage/login', values).then(res => {
                    this.props.setbackstageuser(res)//保存登录状态-全局
                    this.props.history.push('/backstage/index')
                })
            };
            return (
                <Row justify="center" align="middle">
                    <Col span={8}></Col>
                    <Col span={8}>
                        <Form
                            name="normal_login"
                            className="login-form"
                            onFinish={login}
                        >
                            <Form.Item
                                name="mobile"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入手机号',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    addonAfter={(<Button disabled={this.state.smsstatus} onClick={sendSms} type="primary">{this.state.smstext}</Button>)}
                                    onChange={(e) => { this.setState({ mobile: e.target.value }) }}
                                    placeholder="手机号" />
                            </Form.Item>
                            <Form.Item
                                name="pass"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入密码',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    onChange={(e) => { this.setState({ pass: e.target.value }) }}
                                    placeholder="密码或者验证码"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    登录
                            </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                    <Col span={8}></Col>
                </Row>
            );
        }
    }
)
