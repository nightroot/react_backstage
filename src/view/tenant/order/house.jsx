
import React, { Component } from 'react'
import { Table, Input,Rate, Space, Checkbox, Divider, Button, Typography, Image, message, Modal, Form, Select, Upload } from 'antd';
import post from '@/utils/request'
const { Search } = Input;
const { Option } = Select;
const { Title } = Typography


class houseComponent extends Component {
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
            evaluatemodal: {
                type: "create",//查看、编辑、创建模式 look,edit,create
                visible: false,
                data: {
                    stars:0,
                    comment:""
                }
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
        post('/backstage/order/updatestatus', { ...data }).then(res => {
            message.success("更新成功")
            this.get()
        })
    }


    delete = id => {//刪 done
        post('/backstage/order/delete', { id: id }).then(res => {
            message.success("刪除成功")
            this.get()
        })
    }

    get = () => {//查 done
        var params = this.state.params
        params = Object.assign(params, { pagesize: this.state.pagination.pageSize, current: this.state.pagination.current })
        post('/tenant/order/get', params).then(res => {
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
                create_at: "",
                house: {},
                id: -1,
                renting_times: 0,
                status: 0,
                tenant: {},
                uuid: ""
            }
        } else {
            let houseinfo = [
                record.house.title,
                this.state.options.housetype.filter(el => el[0] === record.house.housetype)[0][1],
                record.house.rent + "元",
                this.state.options.style.filter(el => el[0] === record.house.style)[0][1],
                record.house.area + "m²",
                this.state.options.renovation.filter(el => el[0] === record.house.renovation)[0][1],
                "押 " + record.house.deposit + " 付 " + record.house.startrent,
            ]
            record["houseinfo"] = houseinfo.join(" | ")
            let choices = { 0: "保密", 1: "男", 2: "女" }
            record.tenant.gender = record.tenant.gender in [0, 1, 2] ? record.tenant.gender = choices[record.tenant.gender] : record.tenant.gender
            record.house.landlord.gender = record.house.landlord.gender in [0, 1, 2] ? record.house.landlord.gender = choices[record.house.landlord.gender] : record.house.landlord.gender
        }
        this.updateeditmodal({ type: type, visible: true, data: record })
    }



    editmodalhandleOk = (record) => {//确认

        switch (this.state.editmodal.type) {
            case "create":
                post('/backstage/order/create', record).then(res => {
                    message.success("新增成功")
                    this.get()
                })
                break;
            case "edit":
                post('/backstage/order/update', record).then(res => {
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
        const columns = [
            {
                title: '编号',
                dataIndex: 'uuid',
                key: 'uuid',
                sorter: true
            },
            {
                title: '房源编号',
                dataIndex: 'house',
                key: 'house_uuid',
                sorter: true,
                render: data => data.uuid
            },
            {
                title: '房东昵称',
                dataIndex: 'house',
                key: 'landlord_username',
                sorter: true,
                render: data => data.landlord.username
            },
            {
                title: '租客昵称',
                dataIndex: 'tenant',
                key: 'tenant_username',
                sorter: true,
                render: data => data.username
            },
            {
                title: '租客电话',
                dataIndex: 'tenant',
                key: 'tenant_mobile',
                // ellipsis: true,
                sorter: true,
                render: data => data.mobile
            },
            {
                title: '入住时间',
                dataIndex: 'entry_time',
                key: 'entry_time',
                ellipsis: true,
                sorter: true,
            },
            {
                title: '创建时间',
                dataIndex: 'create_at',
                key: 'create_at',
                ellipsis: true,
                sorter: true,
            },
            {
                title: '租期',
                dataIndex: 'renting_times',
                key: 'renting_times',
                ellipsis: true,
                sorter: true,
                // render: text => this.state.options.region.filter(el => text === el[0])[0][1],
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (
                        <Select
                            disabled
                            defaultValue={text}
                            style={{ width: 96 }}
                            // size="small"
                            onChange={(v) => { this.updatestatus({ id: record.id, value: v }) }}>
                            {this.state.options.status.map(el => {
                                return (
                                    <Option key={el[0]} value={el[0]}>{el[1]}</Option>
                                )
                            })}
                        </Select>
                    )
                },
            },
            {
                title: '操作',
                key: 'id',
                render: (text, record) => (
                    <Space size="middle" wrap>
                        <Button size="small" onClick={() => { this.showeditmodal(record, "look") }}>查看</Button>
                        {record.status === 1 ? <Button size="small" onClick={() => {
                            let params = this.state.evaluatemodal
                            let result = Object.assign(params, { visible: true , data:{
                                id:record.id,
                                stars:0,
                                comment:""
                            }})
                            this.setState({ result })
                        }}>评价</Button> : ""}
                        {/* <Button size="small" onClick={() => { this.showeditmodal(record, "edit") }}>编辑</Button>
                        <Button danger size="small" onClick={() => { this.delete(record.id) }} >删除</Button> */}
                    </Space>
                ),
            },
        ];

        const selectedRowKeys = this.state.selectedRowKeys
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const CollectionCreateForm = ({
            visible,
            onCreate,
            onCancel,
        }) => {
            const [form] = Form.useForm();
            var imglist = this.state.editmodal.data.img_list || []
            return (
                <Modal
                    visible={visible}
                    title={this.state.editmodal.type}
                    onCancel={onCancel}
                    onOk={() => {
                        form
                            .validateFields()//取消了所有的默认校验
                            .then(values => {
                                form.resetFields();
                                onCreate(values);
                            })
                            .catch(info => {
                                console.log(info)
                                message.error("字段有误：", info)
                            });
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={this.state.editmodal.data}
                    >
                        <Form.Item name="id" label="标识" hidden><Input type="number" /></Form.Item>
                        <Form.Item name="uuid" label="订单编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'uuid']} label="房源编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'username']} label="租客昵称"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'gender']} label="租客性别"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'mobile']} label="租客电话"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'age']} label="租客年龄"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'username']} label="租客昵称"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'gender']} label="租客性别"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'mobile']} label="租客电话"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'age']} label="租客年龄"><Input type="textarea" /></Form.Item>
                        <Form.Item name="renting_times" label="租期"><Input type="textarea" /></Form.Item>
                        <Form.Item name="entry_time" label="入住时间"><Input type="textarea" /></Form.Item>
                        <Form.Item name="create_at" label="创建时间"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'matching']} label="配套设施">
                            <Checkbox.Group
                                options={this.state.options.matching.map(el => { return { label: el[1], value: el[0] } })}
                            />
                        </Form.Item>
                        <Form.Item name="houseinfo" label="房源信息"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'addr']} label="地址"><Input type="textarea" /></Form.Item>
                        {/* <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item> */}
                        {/* <Form.Item name="title" label="标题"><Input type="textarea" /></Form.Item>
                        <Form.Item name="rent" label="租金"><Input type="textarea" /></Form.Item>
                        <Form.Item name="housetype" label="户型"><Input type="textarea" /></Form.Item>
                        <Form.Item name="style" label="类型">
                            <Select placeholder="选择">
                                {this.state.options.style.map(el => {
                                    return (<Option key={el[0]} value={el[0]}>{el[1]}</Option>)
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="orientation" label="朝向">
                            <Select placeholder="选择">
                                {this.state.options.orientation.map(el => {
                                    return (<Option key={el[0]} value={el[0]}>{el[1]}</Option>)
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="floor" label="楼层">
                            <Input type="number" min={1} max={200} defaultValue={1} />
                        </Form.Item>
                        <Form.Item name="area" label="面积"><Input type="number" defaultValue={20} /></Form.Item>
                        <Form.Item name="renovation" label="装修">
                            <Select placeholder="选择">
                                {this.state.options.renovation.map(el => {
                                    return (<Option key={el[0]} value={el[0]}>{el[1]}</Option>)
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="deposit" label="押金（月）">
                            <Input type="number" min={1} max={200} defaultValue={20} />
                        </Form.Item>
                        <Form.Item name="startrent" label="起租（月）">
                            <Input type="number" min={1} max={200} defaultValue={20} />
                        </Form.Item>
                        <Form.Item name="matching" label="配套设施">
                            <Checkbox.Group
                                options={this.state.options.matching.map(el => { return { label: el[1], value: el[0] } })}
                            />
                        </Form.Item>
                        <Form.Item name="description" label="详情描述"><Input type="textarea" /></Form.Item>
                        <Form.Item name="region" label="地区">
                            <Select placeholder="选择">
                                {this.state.options.region.map(el => {
                                    return (<Option key={el[0]} value={el[0]}>{el[1]}</Option>)
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name="addr" label="具体地址"><Input type="textarea" /></Form.Item>
                        <Form.Item name="img_list" label="图片" >
                            <Upload
                                defaultFileList={[...imglist]}
                                listType="picture-card"
                                maxCount={5}
                            >
                                {imglist.length >= 5 ? null : <div>
                                    <div style={{ marginTop: 8 }}>
                                        上传图片
                                    </div>
                                </div>}
                            </Upload></Form.Item> */}
                    </Form>
                </Modal>
            );
        }


        const EvaluateCreateForm = ({
            visible,
            onCreate,
            onCancel,
        }) => {
            const [form] = Form.useForm();
            return (
                <Modal
                    visible={visible}
                    title={<Title level={4}>发表评价</Title>}
                    onCancel={onCancel}
                    onOk={() => {
                        form
                            .validateFields()//取消了所有的默认校验
                            .then(values => {
                                form.resetFields();
                                onCreate(values);
                            })
                            .catch(info => {
                                console.log(info)
                                message.error("字段有误：", info)
                            });
                    }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={this.state.evaluatemodal.data}
                    >
                        <Form.Item name="id" label="标识" hidden><Input type="number" /></Form.Item>
                        <Form.Item name="stars" label="评分"><Rate /></Form.Item>
                        <Form.Item name="comment" label="评价"><Input.TextArea /></Form.Item>
                       {/* <Form.Item name={['tenant', 'username']} label="租客昵称"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'gender']} label="租客性别"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'mobile']} label="租客电话"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['tenant', 'age']} label="租客年龄"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'username']} label="租客昵称"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'gender']} label="租客性别"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'mobile']} label="租客电话"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'landlord', 'age']} label="租客年龄"><Input type="textarea" /></Form.Item>
                        <Form.Item name="renting_times" label="租期"><Input type="textarea" /></Form.Item>
                        <Form.Item name="entry_time" label="入住时间"><Input type="textarea" /></Form.Item>
                        <Form.Item name="create_at" label="创建时间"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'matching']} label="配套设施">
                            <Checkbox.Group
                                options={this.state.options.matching.map(el => { return { label: el[1], value: el[0] } })}
                            />
                        </Form.Item>
                        <Form.Item name="houseinfo" label="房源信息"><Input type="textarea" /></Form.Item>
                        <Form.Item name={['house', 'addr']} label="地址"><Input type="textarea" /></Form.Item> */}
                    </Form>
                </Modal>
            );
        }
        return (
            <div>
                <CollectionCreateForm
                    visible={this.state.editmodal.visible}
                    onCreate={this.editmodalhandleOk}
                    onCancel={this.editmodalhandleCancel}
                />
                <EvaluateCreateForm
                    visible={this.state.evaluatemodal.visible}
                    onCreate={(record) => {                        
                        post('/tenant/evaluate/create', record).then(res => {
                            message.success("发表成功")
                            let params = this.state.evaluatemodal
                            let result = Object.assign(params, { visible: false })
                            this.setState({ result })
                            this.get()
                        })                        
                     }}
                    onCancel={() => {
                            let params = this.state.evaluatemodal
                            let result = Object.assign(params, { visible: false })
                            this.setState({ result })
                     }}
                />
                <Space size="middle" wrap>
                    <Button onClick={this.get} >刷新</Button>
                    {/* <Button onClick={() => { this.showeditmodal({}, "create") }} >新增房源</Button> */}
                    {/* <Button onClick={() => { this.updatestatus(this.state.selectedRowKeys) }} danger >批量取消发布 </Button> */}
                    <Search placeholder="搜索" onSearch={this.onSearch} enterButton />
                </Space>
                <Divider orientation="left"></Divider>
                <Table
                    rowKey={record => record.id}
                    sticky
                    rowSelection={rowSelection}
                    scroll={{ y: 310 }}
                    columns={columns}
                    dataSource={this.state.list}
                    pagination={this.state.pagination}
                    onChange={this.tableonChange}
                />
            </div>
        )
    }
}

export default houseComponent;
