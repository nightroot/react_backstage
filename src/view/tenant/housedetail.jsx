import { Component } from 'react';
import { Tooltip, Row, Col, List, Typography, Image, Comment, Select, Input, Button, Checkbox, Space, Tag, Carousel, Rate } from 'antd'
import { Icon } from '@ant-design/compatible';
import post from '@/utils/request'
import { message } from 'antd';

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
// 导入我们定义的action
import { settenantuser } from '@/redux/tenant/user';
const { Title } = Typography
const { Search } = Input
const { Option } = Select;

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
    class searchComponent extends Component {
        constructor(props) {
            super(props)

            this.state = {// 组件数据
                option: {
                    housetype: [],
                    style: [],
                    orientation: [],
                    renovation: [],
                    matching: [],
                    region: [],
                },
                options: {
                    housetype: [],
                    style: [],
                    orientation: [],
                    renovation: [],
                    matching: [],
                    region: [],
                },
                house: {
                    title: "",
                    rent: 0,
                    housetype: 0,
                    style: 0,
                    orientation: 0,
                    floor: 0,
                    area: 0,
                    renovation: 0,
                    deposit: 0,
                    startrent: 0,
                    matching: [],
                    description: "",
                    region: 0,
                    addr: "",
                    img_list: [],
                    status: 0,
                    landlord: {
                        id: "", //新增不需要ID
                        age: 0,
                        avatar: "",
                        collectionqrcode: "",
                        enable: 0,
                        gender: 0,
                        idnum: "",
                        mobile: "",
                        name: "",
                        password: "",
                        username: "",
                    }
                },
                comment: [],
                other_house: [],
                collection: {
                    id: 0
                }
            }
        }

        componentDidMount() {
            this.get(this.props.match.params.id)
        }

        get = id => {
            post('/tenant/search/getdetail', { id: id }).then(res => {
                this.setState({ ...res })
            })
        }

        gettagcolor() {
            return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
        }

        updateoption = (data) => {
            let params = this.state.options
            let result = Object.assign(params, data)
            this.setState({ result })
        }
        render() {
            const contentStyle = {
                height: '160px',
                color: '#fff',
                lineHeight: '160px',
                textAlign: 'center',
                background: '#364d79',
            };
            return (
                <div>
                    <Row justify="space-around" align="top" >
                        <Col span={3}></Col>
                        <Col span={12}>
                            <Row justify="center" align="middle">
                                <Col span={24}>
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Title level={4}>{this.state.house.title}</Title>
                                        </Col>
                                        <Col>
                                            <Space>
                                                <Button size="small" onClick={(e) => {
                                                    message.success("检查登录")

                                                    this.props.history.push({
                                                        pathname: '/tenant/order/' + this.state.house.id,
                                                        query: { id: this.state.house.id }
                                                    })
                                                }}>
                                                    我要租房
                                                </Button>
                                                <Button size="small" onClick={(e) => {
                                                    console.log("联系房东")
                                                }}>
                                                    联系房东
                                                </Button>
                                                {this.state.collection.id ?
                                                    <Button size="small" onClick={(e) => {
                                                        post('/tenant/collection/delete', { id: this.state.collection.id }).then(res => {
                                                            this.setState({ collection: { id: 0 } })
                                                            message.success("取消成功")
                                                        })
                                                    }}>
                                                        已收藏
                                                     </Button>
                                                    :
                                                    <Button size="small" onClick={(e) => {
                                                        post('/tenant/collection/enable', { id: this.state.house.id }).then(res => {
                                                            this.setState({ collection: res.collection })
                                                            message.success("收藏成功")
                                                        })
                                                    }}>
                                                        收藏
                                                </Button>}
                                            </Space>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Space>
                                        <Tag color={this.gettagcolor()}>{this.state.house.rent}元/月</Tag>
                                        <Tag color={this.gettagcolor()}>{this.state.options.housetype.filter(el => el[0] === this.state.house.housetype).map(el => el[1])}</Tag>
                                        <Tag color={this.gettagcolor()}>{this.state.house.area}m²</Tag>
                                        <Tag color={this.gettagcolor()}>{this.state.options.style.filter(el => el[0] === this.state.house.style).map(el => el[1])}</Tag>
                                        <Tag color={this.gettagcolor()}>朝{this.state.options.orientation.filter(el => el[0] === this.state.house.orientation).map(el => el[1])}</Tag>
                                    </Space>
                                </Col>
                                <Col span={24}>
                                    <Carousel autoplay style={{ margin: 24 }}>
                                        {this.state.house.img_list.map(img => {
                                            return (
                                                <div key={img} style={{ overflow: "hidden" }}>
                                                    <Image
                                                        style={{ flex: 1, height: 300 }}
                                                        preview={false}
                                                        src={img.url} />
                                                </div>
                                            )
                                        })}
                                    </Carousel>
                                </Col>
                                <Col span={24}>
                                    <Row justify="space-between" align="middle">
                                        <Col>
                                            <Title level={4}>房源信息</Title>
                                        </Col>
                                        <Col>
                                            <Space>
                                                <p >房源编码: {this.state.house.uuid}</p>
                                                <p >发布时间: {this.state.house.create_at}</p>
                                            </Space>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col span={8}>
                                            <p>户型：{this.state.options.housetype.filter(el => el[0] === this.state.house.housetype).map(el => el[1])}</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>装修：{this.state.options.renovation.filter(el => el[0] === this.state.house.renovation).map(el => el[1])}</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>朝向：{this.state.options.orientation.filter(el => el[0] === this.state.house.orientation).map(el => el[1])}</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>楼层：{this.state.house.floor}楼</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>面积：{this.state.house.area}m²</p>
                                        </Col>
                                        <Col span={8}>
                                            <p>类型：{this.state.options.style.filter(el => el[0] === this.state.house.style).map(el => el[1])}</p>
                                        </Col>
                                        <Col span={24}>
                                            <p>地址：{this.state.house.addr}</p>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row justify="space-between" align="middle">
                                        <Col soan={24}>
                                            <Title level={4}>配套设施</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <Col span={24}>
                                            <Checkbox.Group
                                                disabled
                                                value={this.state.house.matching}
                                            >
                                                <Row>
                                                    {this.state.options.matching.map(el => {
                                                        return (
                                                            <Col span={4} key={el.value}>
                                                                <Checkbox value={el.value}>{el.label}</Checkbox>
                                                            </Col>
                                                        )
                                                    })}
                                                </Row>
                                            </Checkbox.Group>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row justify="space-between" align="middle">
                                        <Col soan={24}>
                                            <Title level={4}>房源详情</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <p>{this.state.house.description}</p>
                                    </Row>
                                </Col>
                                <Col span={24}>
                                    <Row justify="space-between" align="middle">
                                        <Col soan={24}>
                                            <Title level={4}>租客评论</Title>
                                        </Col>
                                    </Row>
                                    <Row justify="space-between" align="middle">
                                        <List
                                            className="租客评论"
                                            // header={`${data.length} replies`}
                                            itemLayout="horizontal"
                                            dataSource={this.state.comment}
                                            renderItem={item => (
                                                <li>
                                                    <Comment
                                                        author={item.order.tenant.username}
                                                        avatar={item.order.tenant.avatar}
                                                        content={item.comment}
                                                        datetime={item.create_at}
                                                    >
                                                        <Rate disabled defaultValue={item.stars} />
                                                    </Comment>
                                                </li>
                                            )}
                                        />
                                    </Row>
                                    <br /><br /><br /><br /><br />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={4} >
                            <Row justify="space-around">
                                <Col span={16}>
                                    <Image width={128} height={128} preview={false} style={{ margin: "auto" }} src={this.state.house.landlord.avatar} />
                                </Col>
                            </Row>
                            <Row justify="center">
                                <Col span={16} flex="auto">
                                    <Button type="link" onClick={e => {
                                        console.log("房东链接")
                                    }}>
                                        <Title level={4}>房东： {this.state.house.landlord.username}</Title>
                                    </Button>
                                </Col>
                            </Row>
                            {/* <Row justify="space-around">
                                <Col span={16}>
                                    <Rate disabled defaultValue={this.state.house.stars} />
                                </Col>
                            </Row> */}
                            <br></br>
                            <Row justify="space-around">
                                <Col span={12}>
                                    <Button onClick={e => {
                                        console.log("其他房源")
                                    }}>其他房源</Button>
                                </Col>
                            </Row><br></br>
                            <Row>
                                {this.state.other_house.map(house => {
                                    return (
                                        <Col key={house.id} span={24}>
                                            <Row justify="center">
                                                <Col span={12}>
                                                    <Image width={96} height={96} preview={false} style={{ margin: "auto" }} src={house.img_list.length > 0 ? house.img_list[0].url : ""} />
                                                </Col>
                                            </Row>
                                            <Row justify="center">
                                                <Col>
                                                    <Button type="link" onClick={e => {
                                                        this.get(house.id)
                                                        this.props.history.push({ pathname: '/tenant/housedetail/' + house.id, query: { "id": house.id } })
                                                    }}>
                                                        <Title level={5}>{house.title} </Title>
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Col>
                        <Col span={3} />
                    </Row>
                </div>
            );
        }
    }
)
