import { Component } from 'react';
import { Row, Col, Divider, Typography, Image, Radio, Select, Input, Button, Checkbox, Space, Tag, message } from 'antd'
import { Icon } from '@ant-design/compatible';
import post from '@/utils/request'

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
                list: [
                    //     {
                    //     id: 1,
                    //     title: "南坪万寿花园正规一室一厅",
                    //     housetype: "一室",
                    //     area: "20",
                    //     startrent: "半年",
                    //     rent: "1000",
                    //     orientation: "南",
                    //     style: "整租",
                    //     addr: "南岸区-南坪-金紫街-167号-万寿花园西区",
                    //     img_list: [{url:"https://dummyimage.com/600x600"}]

                    // }
                ],
                limit: {
                    search: "",
                    region: -1,
                    rent: -1,
                    area: -1,
                    housetype: -1,
                    orientation: -1,
                    floor: -1,
                    renovation: -1,
                    style: -1,
                    matching: [],
                    sort: [],//存在即为asc 从小到大
                },
                option: {
                    region: [],
                    rent: [],
                    area: [],
                    housetype: [],
                    orientation: [],
                    floor: [],
                    renovation: [],
                    style: [],
                    matching: [],
                    sort: [],
                },
                showmore: false
            }
        }

        componentDidMount() {

            post('/tenant/search/getchoices', {}).then(res => {
                this.updateoption({ ...res })
                this.updatelimit({ sort: res.sort })
            })

            if (this.props.location.query !== undefined) {
                // 挂载搜索
                this.updatelimit({ search: this.props.location.query.text })
            }


            this.updatelimit({
                region: -1,
                rent: -1,
                area: -1,
                housetype: -1,
                orientation: -1,
                floor: -1,
                renovation: -1,
                style: -1,
            })
            // console.log(this.props.location.query.text)
            this.search()
        }

        updatelimit = (data) => {
            let params = this.state.limit
            let result = Object.assign(params, data)
            this.setState({ result })
        }

        updateoption = (data) => {
            let params = this.state.option
            let result = Object.assign(params, data)
            this.setState({ result })
        }


        search = () => {
            //搜索            
            post('/tenant/search/get', this.state.limit).then(res => {
                this.setState({ list: res.list })
            })
        }

        render() {
            return (
                <div>
                    <Row justify="center" align="middle" >
                        <Col span={16}>
                            <Row justify="center" align="middle">
                                <Col span={20}>
                                    <Search
                                        placeholder="搜索"
                                        allowClear
                                        enterButton="搜索"
                                        size="large"
                                        style={{ marginTop: 64, marginBottom: 48, width: "100%" }}
                                        value={this.state.limit.search}
                                        onChange={e => {
                                            this.updatelimit({ search: e.target.value })
                                        }}
                                        onSearch={this.search}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ border: '1px solid #ccc' }} justify="center" align="middle" gutter={24}>
                                <Col span={24}>
                                    <Row>
                                        <Col span={2}>区域</Col>
                                        <Col span={22}>
                                            <Radio.Group
                                                onChange={(e) => { this.updatelimit({ region: e.target.value }) }}
                                                value={this.state.limit.region}
                                                size="small">
                                                {/* <Radio.Group onChange={onChange} value={value}> */}
                                                {this.state.option.region.map(item => {
                                                    return (
                                                        <Radio.Button key={item[0]} value={item[0]}>{item[1]}</Radio.Button>
                                                    )
                                                })}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={2}>租金</Col>
                                        <Col span={22}>
                                            <Radio.Group
                                                onChange={(e) => { this.updatelimit({ rent: e.target.value }) }}
                                                value={this.state.limit.rent}
                                                size="small">
                                                {this.state.option.rent.map(item => {
                                                    return (
                                                        <Radio.Button key={item[0]} value={item[0]}>{item[1]}</Radio.Button>
                                                    )
                                                })}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={2}>面积</Col>
                                        <Col span={22}>
                                            <Radio.Group
                                                onChange={(e) => { this.updatelimit({ area: e.target.value }) }}
                                                value={this.state.limit.area}
                                                size="small">
                                                {this.state.option.area.map(item => {
                                                    return (
                                                        <Radio.Button key={item[0]} value={item[0]}>{item[1]}</Radio.Button>
                                                    )
                                                })}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={2}>户型</Col>
                                        <Col span={22}>
                                            <Radio.Group
                                                onChange={(e) => { this.updatelimit({ housetype: e.target.value }) }}
                                                value={this.state.limit.housetype}
                                                size="small">
                                                {this.state.option.housetype.map(item => {
                                                    return (
                                                        <Radio.Button key={item[0]} value={item[0]}>{item[1]}</Radio.Button>
                                                    )
                                                })}
                                            </Radio.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={2}></Col>
                                        <Col span={22}>
                                            <Row>
                                                <Col span={6}>
                                                    <Row>
                                                        <Col span={6}>朝向</Col>
                                                        <Col span={18}>
                                                            <Select
                                                                defaultValue={-1}
                                                                style={{ width: 96 }}
                                                                size="small"
                                                                onChange={(v) => { this.updatelimit({ orientation: v }) }}
                                                                allowClear>
                                                                {this.state.option.orientation.map(item => {
                                                                    return (
                                                                        <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row>
                                                        <Col span={6}>楼层</Col>
                                                        <Col span={18}>
                                                            <Select
                                                                defaultValue={-1}
                                                                style={{ width: 96 }}
                                                                size="small"
                                                                onChange={(v) => { this.updatelimit({ floor: v }) }}
                                                                allowClear>
                                                                {this.state.option.floor.map(item => {
                                                                    return (
                                                                        <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row>
                                                        <Col span={6}>装修</Col>
                                                        <Col span={18}>
                                                            <Select
                                                                defaultValue={-1}
                                                                style={{ width: 96 }}
                                                                size="small"
                                                                onChange={(v) => { this.updatelimit({ renovation: v }) }}
                                                                allowClear>
                                                                {this.state.option.renovation.map(item => {
                                                                    return (
                                                                        <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col span={6}>
                                                    <Row>
                                                        <Col span={6}>类型</Col>
                                                        <Col span={18}>
                                                            <Select
                                                                defaultValue={-1}
                                                                style={{ width: 96 }}
                                                                size="small"
                                                                onChange={(v) => { this.updatelimit({ style: v }) }}
                                                                allowClear>
                                                                {this.state.option.style.map(item => {
                                                                    return (
                                                                        <Option key={item[0]} value={item[0]}>{item[1]}</Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Button type="link" size="small" onClick={() => this.setState({ showmore: !this.state.showmore })}>{this.state.showmore ? "更少" : "更多"}</Button>
                                        </Col>
                                    </Row>
                                    <Row style={!this.state.showmore ? { display: 'none' } : {}}>
                                        <Col span={2}>配套设施</Col>
                                        <Col span={22}>
                                            <Checkbox.Group
                                                options={this.state.option.matching}
                                                onChange={(v) => this.updatelimit({ matching: v })}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={24} justify="end" align="middle">
                                <Col span={4}>默认排序</Col>
                                {this.state.option.sort.map(el => {
                                    return (
                                        <Col key={el.field} span={2}>
                                            <Button
                                                type="link"
                                                size="small"
                                                onClick={() => {
                                                    let option=["","asc","desc"]
                                                    let sort=option[(option.indexOf(el.sort)+1)%3]
                                                    let update=this.state.limit.sort.map(item=>{
                                                        if(item.field===el.field){
                                                            return Object.assign(item, {sort:sort})
                                                        }
                                                        return item
                                                    })
                                                    this.updatelimit(update)
                                                }}>
                                                {el.label}
                                                {el.sort !== "" ? (
                                                    el.sort === "asc" ?
                                                        <Icon type="arrow-up" /> :
                                                        <Icon type="arrow-down" />)
                                                    : ""}
                                            </Button>
                                        </Col>
                                    )
                                })}
                            </Row>
                            <Row gutter={24} align="middle">
                                <Col span={24} style={{ cursor: "pointer" }}>
                                    {this.state.list.map(el => {
                                        return (
                                            <Row key={el.id} onClick={(e) => {
                                                this.props.history.push({ pathname: '/tenant/housedetail/'+el.id, query: { "id": el.id } })
                                                // console.log(el.id)
                                            }} justify="space-around">
                                                <Col span={4}>
                                                    <Image src={el.img_list.length > 0 ? el.img_list[0].url : ""}></Image>
                                                </Col>
                                                <Col span={14}  >
                                                    <Title level={4}>{el.title}</Title>
                                                    <Space split={<Divider type="vertical" />}>
                                                        <p level={5}>{this.state.option.housetype.filter(item => el.housetype === item[0])[0][1]}</p>
                                                        <p level={5}>{el.area}m²</p>
                                                        <p level={5}>押{el.deposit}付{el.startrent}</p>
                                                        {/* <p level={5}>{el.startrent}个月起租</p> */}
                                                    </Space>
                                                    <Title level={5}>{el.addr}</Title>
                                                    <Space size="small">
                                                        <Tag color="orange">{this.state.option.style.filter(item => el.style === item[0])[0][1]}</Tag>
                                                        <Tag color="green">朝{this.state.option.orientation.filter(item => el.orientation === item[0])[0][1]}</Tag>
                                                    </Space>
                                                </Col>
                                                <Col span={4}>
                                                    <Title level={3} style={{ marginTop: "30%" }}>{el.rent}元/月</Title>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                </Col>
                            </Row>
                            <br /><br /><br /><br /><br /><br /><br /><br />
                        </Col>
                    </Row>
                </div>
            );
        }
    }
)
