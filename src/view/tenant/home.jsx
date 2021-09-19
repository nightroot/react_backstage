import { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import post from '@/utils/request'

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
import { setbackstageuser } from '@/redux/backstage/user';
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
    class homeComponent extends Component {
        constructor(props) {
            super(props)
            this.state = {// 组件数据
                // phone: "15730042144",
                // pass: "",
                // smstext: "发送验证码",
                // smscount: 0,
                // smsstatus: false
            }
        }
        render() {

            const login = (values) => {
                // 登录
                post('/backstage/login', values).then(res => {
                    this.props.setbackstageuser(res)//保存登录状态-全局
                })
            };
            return (
                <Row justify="center" align="middle">
                    <Col span={8}></Col>
                    <Col span={8}>
                    主页
                    </Col>
                    <Col span={8}></Col>
                </Row>
            );
        }
    }
)
