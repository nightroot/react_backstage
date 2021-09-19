
import React, { Component } from 'react'
import { Row, Col, Input, Space, Typography, Divider, Button, Tag, Image, message, Tooltip, Form, Select, Upload } from 'antd';
import post from '@/utils/request'
import { StarTwoTone,StarFilled } from '@ant-design/icons';
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography


class mycollectionComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {// 组件数据
            list: [],
            options: {
                housetype: [],
                style: [],
                orientation: [],
                renovation: [],
                matching: [],
                region: [],
                status: []
            },
            pagination: {
                pageSize: 10,
                current: 1,
            },
            selectedRowKeys: [],

            editmodal: {
                type: "create",//查看、编辑、创建模式 look,edit,create
                visible: false,
                data: {}
            },
            params: {
                //分页
                pagesize: 10,
                current: 1,
                //筛选
                search: "",
                //排序
                field: "",
                order: ""
            },
            fileList: []
        }
        props.history.listen(() => {
            //监控跳转,更改title
            // console.log(this.props.location)
        })
    }
    componentDidMount() {
        this.get()
    }

    updatestate = data => {//动态更新state done
        let state = this.state
        let result = Object.assign(state, data)
        this.setState({ result })
    }

    updateparams = data => {//查詢参数更新 done
        let params = this.state.params
        let result = Object.assign(params, data)
        this.setState({ result })
    }
    updatepagination = data => {//分页参数更新 done
        let pagination = this.state.pagination
        let result = Object.assign(pagination, data)
        this.setState({ result })
    }

    updateeditmodal = data => {//查詢参数更新 done
        let params = this.state.editmodal
        let result = Object.assign(params, data)
        this.setState({ result })
    }

    updatestatus = data => { // done
        // [1,2,3] 全部false  - 服务端处理
        // [1] 这种看情况
        post('/tenant/collection/updatestatus', { ...data }).then(res => {
            message.success("更新成功")
            this.get()
        })
    }


    delete = id => {//刪 done
        post('/tenant/collection/delete', { id: id }).then(res => {
            message.success("刪除成功")
            this.get()
        })
    }

    get = () => {//查 done
        var params = this.state.params
        params = Object.assign(params, { pagesize: this.state.pagination.pageSize, current: this.state.pagination.current })
        post('/tenant/collection/get', params).then(res => {
            // datalist=res.list.map(el=>{
            //     el.img
            // })
            this.setState({ list: res.list, options: res.options })
            this.updatestate({
                pagination: {
                    current: res.current,
                    pageSize: res.pagesize,
                    total: res.total,
                    showTotal: (total) => `共 ${total} 条`,
                    showSizeChanger: true,
                }
            })
        })
    }

    onSelectChange = (selectedRowKeys, selectedRows) => {//多选 done
        this.setState({ selectedRowKeys });
    }

    tableonChange = (pagination, filters, sorter, extra) => {//分页，筛选，排序 done
        // 分页
        console.log(pagination)
        this.updatepagination(pagination)
        // 筛选处理 - 这里不实现复杂需求了，交由onSearch筛选
        // 排序处理
        this.updateparams({ field: sorter.field ? sorter.field : "", order: sorter.order ? sorter.order : "" })
        //更新
        this.get()
    }

    onSearch = value => { //done 
        this.updateparams({ search: value })
        this.get()
    }

    showeditmodal = (record, type) => {//打开模态框 查看编辑创建 look,edit,create   - done
        if (type === "create") {
            record = {
                // create_at: "",
                // house: {},
                // id: -1,
                // renting_times: 0,
                // status: 0,
                // tenant: {},
                // uuid: ""
            }
        }
        // else {
        //     let houseinfo=[
        //         record.house.title,
        //         this.state.options.housetype.filter(el=>el[0]===record.house.housetype)[0][1],
        //         record.house.rent+"元",
        //         this.state.options.style.filter(el=>el[0]===record.house.style)[0][1],
        //         record.house.area+"m²",
        //         this.state.options.renovation.filter(el=>el[0]===record.house.renovation)[0][1],
        //         "押 "+record.house.deposit+" 付 "+record.house.startrent,
        //     ]
        //     record["houseinfo"]=houseinfo.join(" | ")
        //     let choices = { 0: "保密", 1: "男", 2: "女" }
        //     record.tenant.gender = record.tenant.gender in [0, 1, 2] ? record.tenant.gender = choices[record.tenant.gender] : record.tenant.gender
        //     record.house.landlord.gender = record.house.landlord.gender in [0, 1, 2] ? record.house.landlord.gender = choices[record.house.landlord.gender] : record.house.landlord.gender
        // }
        this.updateeditmodal({ type: type, visible: true, data: record })
    }



    editmodalhandleOk = (record) => {//确认

        switch (this.state.editmodal.type) {
            case "create":
                post('/tenant/collection/create', record).then(res => {
                    message.success("新增成功")
                    this.get()
                })
                break;
            case "edit":
                post('/tenant/collection/update', record).then(res => {
                    message.success("更新成功")
                    this.get()
                })
                break;
            case "look"://不做任何处理
                break;
            default:
                message.error("类型不匹配！")
        }
        this.updateeditmodal({ visible: false })
    }

    editmodalhandleCancel = () => {//取消 done
        this.updateeditmodal({ visible: false })
    }

    imglistonchange = e => {
        console.log(e)
    }

    render() {
        return (
            <div style={{ height: "100%", overflow: "scroll" }}>
                <Row>
                    <Col span={24}>
                        {this.state.list.map(item => {
                            var el = item.house
                            return (
                                <Row style={{ border: "1px solid #ccc", margin: 16, padding: 8 }} key={el.id} justify="space-around">
                                    <Col span={4}>
                                        <Image src={el.img_list.length > 0 ? el.img_list[0].url : ""}></Image>
                                    </Col>
                                    <Col span={14} style={{ cursor: "pointer" }} onClick={(e) => {
                                        this.props.history.push({ pathname: '/tenant/housedetail', query: { "id": el.id } })
                                        console.log(el.id)
                                    }} >
                                        <Title level={4}>{el.title}</Title>
                                        <Space split={<Divider type="vertical" />}>
                                            <p level={5}>{this.state.options.housetype.filter(tmp => el.housetype === tmp[0])[0][1]}</p>
                                            <p level={5}>{el.area}m²</p>
                                            <p level={5}>{el.startrent}月起租</p>
                                        </Space>
                                        <Title level={5}>{el.addr}</Title>
                                        <Space size="small">
                                            <Tag color="orange">{this.state.options.style.filter(tmp => el.style === tmp[0])[0][1]}</Tag>
                                            <Tag color="green">朝{this.state.options.orientation.filter(tmp => el.orientation === tmp[0])[0][1]}</Tag>
                                        </Space>
                                    </Col>
                                    <Col span={4} align="center">
                                        <Title level={3} style={{ marginTop: "30%" }}>{el.rent}元/月</Title>
                                        
                                        <Tooltip placement="bottom" title="取消收藏" arrowPointAtCenter>
                                               <StarFilled  
                                        twoToneColor="#ffbf00" 
                                        style={{ fontSize: '48px',color:'#ffbf00', cursor: "pointer" }}
                                        onClick={()=>{
                                            this.delete(item.id)
                                        }} />
                                            </Tooltip>
                                        
                                    </Col>
                                </Row>

                            )
                        })}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default mycollectionComponent;
