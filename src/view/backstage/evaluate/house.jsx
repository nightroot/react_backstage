
import React, { Component } from 'react'
import { Table, Input, Space, Avatar, Divider, Button, Switch, Image, message, Modal, Form, Select, Upload } from 'antd';
import post from '@/utils/request'
const { Search } = Input;
const { Option } = Select;


class evaluateComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {// 组件数据
            list: [],
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
            editavatarshow: false,
            editqrcodeshow: false,
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
        post('/backstage/evaluate/updateenable', { id_list: data }).then(res => {
            message.success("更新成功")
            this.get()
        })
    }


    delete = id => {//刪 done
        post('/backstage/evaluate/delete', { id: id }).then(res => {
            message.success("刪除成功")
            this.get()
        })
    }

    get = () => {//查 done
        var params = this.state.params
        params = Object.assign(params, { pagesize: this.state.pagination.pageSize, current: this.state.pagination.current })
        post('/backstage/evaluate/get', params).then(res => {
            this.setState({ list: res.list })
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
                // id: "", //新增不需要ID
                // age: 0,
                // avatar: "",
                // collectionqrcode: "",
                // enable: 0,
                // gender: 0,
                // idnum: "",
                // mobile: "",
                // name: "",
                // password: "",
                // username: "",
            }
        }
        this.updateeditmodal({ type: type, visible: true, data: record })
    }



    editmodalhandleOk = (record) => {//确认
        switch (this.state.editmodal.type) {
            case "create":
                post('/backstage/evaluate/create', upload).then(res => {
                    message.success("新增成功")
                    this.get()
                })
                break;
            case "edit":
                post('/backstage/evaluate/update', upload).then(res => {
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

    render() {
        const columns = [
            {
                title: '订单编号',
                dataIndex: 'order',
                key: 'order_uuid',
                sorter: true
            },
            {
                title: '房源编号',
                dataIndex: 'order',
                key: 'order_house_uuid',
                sorter: true
            },
            {
                title: '评价人姓名',
                dataIndex: 'order',
                key: 'order_tenant_name',
                sorter: true,
            },
            {
                title: '评价人电话',
                dataIndex: 'order',
                key: 'order_tenant_mobile',
                sorter: true,
            },
            {
                title: '状态',
                dataIndex: 'enable',
                key: 'enable',
                render: (text, record) => <Switch size="middle" checkedChildren="已审核" unCheckedChildren="未审核" defaultChecked={text === 1 ? true : false} onChange={value => this.updatestatus([record.id])} />,
            },
            {
                title: '操作',
                key: 'id',
                render: (text, record) => (
                    <Space size="middle" wrap>
                        <Button size="small" onClick={() => { this.showeditmodal(record, "look") }}>查看</Button>
                        <Button size="small" onClick={() => { this.showeditmodal(record, "edit") }}>编辑</Button>
                        <Button danger size="small" onClick={() => { this.delete(record.id) }} >删除</Button>
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
                        <Form.Item name="username" label="昵称">
                            <Input type="textarea" />
                        </Form.Item>
                        <Form.Item name="mobile" label="手机号">
                            <Input type="textarea" />
                        </Form.Item>
                        <Form.Item name="password" label="密码">
                            <Input type="password" />
                        </Form.Item>
                        <Form.Item name="name" label="名字">
                            <Input type="textarea" />
                        </Form.Item>
                        <Form.Item name="gender" label="性别">
                            <Select defaultValue={0} placeholder="选择">
                                <Option value={0}>保密</Option>
                                <Option value={1}>男</Option>
                                <Option value={2}>女</Option>
                            </Select>
                            {/* <Input type="textarea" /> */}
                        </Form.Item>
                        <Form.Item name="age" label="年龄">
                            <Input type="number" min={1} max={200} defaultValue={20} />
                        </Form.Item>
                        <Form.Item name="idnum" label="身份证号">
                            <Input type="textarea" />
                        </Form.Item>
                        <Form.Item name="avatarimg" label="头像" >
                            <Upload
                                name="avatarimg"
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={false}
                            >
                                <div>
                                    <div style={{ marginTop: 8 }}>
                                        <Image preview={false} src={this.state.editmodal.data.avatar}></Image>
                                    </div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item name="collectionqrcodeimg" label="收款码">
                            <Upload name="collectionqrcodeimg" listType="picture-card" maxCount={1} beforeUpload={() => false}>
                                <div>
                                    <div style={{ marginTop: 8 }}>
                                        <Image preview={false} src={this.state.editmodal.data.collectionqrcode}></Image>
                                    </div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Form.Item name="enable" label="状态" valuePropName="checked">
                            <Switch />
                        </Form.Item>
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
                <Space size="middle" wrap>
                    <Button onClick={this.get} >刷新</Button>
                    <Button onClick={() => { this.showeditmodal({}, "create") }} >新增用户</Button>
                    <Button onClick={() => { this.updatestatus(this.state.selectedRowKeys) }} danger >批量禁用 </Button>
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

export default evaluateComponent;
