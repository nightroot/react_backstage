import { Component } from 'react';
import {message,Modal, Row, Col, Divider, Typography, Image, InputNumber, DatePicker, Input, Button, Checkbox, Space, Tag, Carousel, Rate } from 'antd'
import moment from 'moment';
import post from '@/utils/request'

// 使用react-redux中的connect方法
import { connect } from 'react-redux';
// 导入我们定义的action
import { settenantuser } from '@/redux/tenant/user';
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
                house: {
                    landlord: {
                        id: 1,
                        username: "",
                        mobile: ""
                    },
                    id: 1,
                    title: "",
                    housetype:  0,
                    area:  0,
                    startrent:  0,
                    rent:  0,
                    orientation: 0,
                    style: 0,
                    addr: "",
                    img_list: []
                },
                order: {
                    pay: 0,
                    entry_time:"",
                    renting_times:"",
                },
                options: {
                    housetype: [],
                    style: [],
                    orientation: [],
                    renovation: [],
                    matching: [],
                    region: [],
                },
                msgchecked: false,
                msgmodal:false,
                qrcodemodal:false
            }
        }

        componentDidMount() {            
            post('/tenant/order/getschema', { id: this.props.match.params.id }).then(res => {
                this.setState({ ...res })
                this.updateorder({
                    pay:0,
                    entry_time:moment().format('YYYY/MM/DD'),
                    renting_times:res.house.startrent
                })
            })
        }

        updateorder = (data) => {
            let params = this.state.order
            let result = Object.assign(params, data)
            this.setState({ result })
        }


        get=id=>{
            post('/tenant/order/getschema', { id: id }).then(res => {
                this.setState({ ...res })
            })
        }

        create=record=>{
            post('/tenant/order/create',record).then(res => {
                message.success("订单创建成功,请付款")
                this.updateorder({id:res.id})
                this.setState({qrcodemodal:true})
            })
        }

        render() {
            return (
                <div>
                    <Row justify="center" align="middle" >
                        <Col span={16}>
                            <Row>
                                <Col span={24}>
                                    <Title level={4}>房东信息</Title>
                                </Col>
                                <Col span={24}>
                                    <Space>

                                        <Title level={5}>{this.state.house.landlord.username}</Title>
                                        <Title level={5}>{this.state.house.landlord.mobile}</Title>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" >
                        <Col style={{ border: '1px solid #ccc' }} span={16}>
                            <Row key={this.state.house.id} justify="space-around">
                                <Col span={4}>
                                    <Image preview={false} src={this.state.house.img_list.length>0?this.state.house.img_list[0].url:""}></Image>
                                </Col>
                                <Col span={14}  >
                                    <Title level={4}>{this.state.house.title}</Title>
                                    <Space split={<Divider type="vertical" />}>
                                        <p level={5}>{this.state.options.housetype.filter(el=>el[0]===this.state.house.housetype).map(el=>el[1])}</p>
                                        <p level={5}>{this.state.house.area}m²</p>
                                        <p level={5}>押{this.state.house.deposit}付{this.state.house.startrent}</p>
                                        <p level={5}>{this.state.house.startrent}个月起租</p>
                                    </Space>
                                    <Title level={5}>{this.state.house.addr}</Title>
                                    <Space size="small">
                                        <Tag color="orange">{this.state.options.style.filter(el=>el[0]===this.state.house.style).map(el=>el[1])}</Tag>
                                        <Tag color="green">朝{this.state.options.orientation.filter(el=>el[0]===this.state.house.orientation).map(el=>el[1])}</Tag>
                                    </Space>
                                </Col>
                                <Col span={4}>
                                    <Title level={3} style={{ marginTop: "30%" }}>{this.state.house.rent}元/月</Title>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={16}>
                            <Row justify="center" align="space-between" >
                                <Col span={8} >

                                    <Space align="center">
                                        <Title level={4}>租期：</Title>
                                        <InputNumber size="small" 
                                        min={this.state.house.startrent} 
                                        max={120} 
                                        value={this.state.order.renting_times}
                                        onChange={data => {
                                            let pay=(this.state.house.deposit+data)*this.state.house.rent
                                            this.updateorder({pay:pay,renting_times:data})
                                        }}
                                        ></InputNumber>个月
                                    </Space>
                                </Col>
                                <Col span={8} >
                                    <Space align="center">
                                        <Title level={4}>入住时间</Title>
                                        <DatePicker 
                                        defaultValue={moment()} 
                                        format={'YYYY/MM/DD'}
                                        allowClear={false}
                                        onChange={(date, dateString) => {
                                            this.updateorder({entry_time:dateString})
                                            let pay=(this.state.house.deposit+this.state.order.renting_times)*this.state.house.rent
                                            this.updateorder({pay:pay,entry_time:dateString})
                                        }} />
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col span={16} flex="0 1">
                            <Space direction="vertical" >
                                <div style={{ width: '100%' }}>
                                    <Checkbox
                                        onChange={e => {
                                            this.setState({ msgchecked: this.state.msgchecked?false:true })
                                        }}
                                        checked={this.state.msgchecked}
                                    >我已知晓并同意接受房屋租赁合同</Checkbox>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <Button onClick={()=>this.setState({msgmodal:true})}>查看房屋协议合同</Button>
                                          <Modal 
                                          title="房屋协议合同" 
                                          visible={this.state.msgmodal} 
                                          onOk={()=>this.setState({msgmodal:false})} 
                                          onCancel={()=>this.setState({msgmodal:false})} 
                                        >
                                        <p>
                                            
出租方：_{this.state.house.landlord.name}_(以下简称甲方)<br/>
承租方：_{this.props.tenantuser.name}_(以下简称乙方)<br/>
甲、乙双方就房屋租赁事宜，达成如下协议：<br/>
一、甲方将位于{this.state.options.region.filter(el=>el[0]===this.state.house.region).map(el=>el[1])}区（县）{this.state.house.addr}的房屋出租给乙方居住使用，租赁期限自{this.state.order.entry_time}至{moment().add(this.state.order.renting_times,'months').subtract(1,'day').format('YYYY/MM/DD')}，计{this.state.order.renting_times}个月。<br/>
二、本房屋月租金为人民币{this.state.house.rent}元，租金到期前15日内，乙方向甲方支付至少{this.state.house.startrent}个月租金。<br/>
三、乙方租赁期间，水费、电费、取暖费、燃气费、电话费、物业费以及其它由乙方居住而产生的费用由乙方负担。租赁结束时，乙方须交清欠费。<br/>
四、乙方同意预交_{this.state.house.deposit*this.state.house.rent}_元作为保证金，合同终止时，当作房租冲抵。<br/>
五、房屋租赁期为_{this.state.order.renting_times}个月_，从_{moment(this.state.order.entry_time).year()}_年_{moment(this.state.order.entry_time).month()}_月__{moment(this.state.order.entry_time).day()}_日至_{moment(this.state.order.entry_time).add(this.state.order.renting_times,'months').subtract(1,'day').year()}_年_{moment(this.state.order.entry_time).add(this.state.order.renting_times,'months').subtract(1,'day').month()}_月_{moment(this.state.order.entry_time).add(this.state.order.renting_times,'months').subtract(1,'day').day()}_日。在此期间，任何一方要求终止合同，须提前三个月通知对方，并偿付对方总租金的违约金；如果甲方转让该房屋，乙方有优先购买权。<br/>
六、因租用该房屋所发生的除土地费、大修费以外的其它费用，由乙方承担。<br/>
七、在承租期间，未经甲方同意，乙方无权转租或转借该房屋；不得改变房屋结构及其用途，由于乙方人为原因造成该房屋及其配套设施损坏的，由乙方承担赔偿责任。<br/>
八、甲方保证该房屋无产权纠纷；乙方因经营需要，要求甲方提供房屋产权证明或其它有关证明材料的，甲方应予以协助。<br/>
九、就本合同发生纠纷，双方协商解决，协商不成，任何一方均有权向{this.state.options.region.filter(el=>el[0]===this.state.house.region).map(el=>el[1])}区(县)人民法院提起诉讼，请求司法解决。<br/>
十、本合同连一式2份，甲、乙双方各执1份，自双方签字之日起生效。<br/>
甲方：{this.state.house.landlord.name}<br/>
乙方：{this.props.tenantuser.name}<br/>
__{moment().year()}_年_{moment().month()}_月__{moment().day()}_日<br/>
                                        </p>                                   
                                           </Modal>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                    <Row justify="center">
                        <Col style={{ border: '1px solid #ccc', marginTop: 24, padding: 10 }} span={16}>
                            <Row justify="center" align="space-between" >
                                <Col span={8} >
                                    <Space align="center">
                                        <Title level={4}>实付款:{(this.state.house.deposit+this.state.order.renting_times)*this.state.house.rent}元（含押金）</Title>
                                    </Space>
                                </Col>
                                <Col span={8} flex="0 1">
                                    <Button onClick={() => {
                                        let pay=(this.state.house.deposit+this.state.order.renting_times)*this.state.house.rent
                                        this.updateorder({pay:pay})
                                        if(this.state.msgchecked){
                                            let params={
                                                house:this.state.house.id,
                                                entry_time:this.state.order.entry_time,
                                                renting_times:this.state.order.renting_times,
                                                deposit_cost:this.state.house.deposit*this.state.house.rent,
                                                total_cost:(this.state.house.deposit+this.state.order.renting_times)*this.state.house.rent
                                            }
                                            this.create(params)
                                        }else{
                                            message.error("请勾选同意房屋租赁合同")
                                        }
                                    }}>提交订单</Button>
                                        <Modal title="付款" 
                                        visible={this.state.qrcodemodal} 
                                        cancelText="取消付款"
                                        okText="我已完成付款"
                                        onOk={e=>{                                            
                                            post('/backstage/order/updatestatus',{id:this.state.order.id,value:1}).then(res=>{
                                                message.success("已完成付款")
                                                this.setState({qrcodemodal:false})
                                                this.props.history.push({ pathname: '/tenant/housedetail/' + this.state.house.id, query: { "id":this.state.house.id } })
                                            })
                                        }} 
                                        onCancel={e=>{
                                            this.setState({qrcodemodal:false})
                                        }}>
                                        <Image height={256} width={256} src={this.state.house.landlord.collectionqrcode}></Image>
                                            {/* <Input.Password value={this.state.modify_pass.old} onChange={(e) => { this.changemodifypass({ old: e.target.value }) }} placeholder="旧密码" />
                                            <Input.Password value={this.state.modify_pass.new} onChange={(e) => { this.changemodifypass({ new: e.target.value }) }} placeholder="新密码" />
                                            <Input.Password value={this.state.modify_pass.renew} onChange={(e) => { this.changemodifypass({ renew: e.target.value }) }} placeholder="新密码" /> */}
                                        {/* 我已付款 */}
                                        </Modal>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            );
        }
    }
)
