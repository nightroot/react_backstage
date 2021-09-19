
import React, { Component } from 'react'
import { Table, Input, Space, Checkbox, Divider, Button, Switch, Image, message, Modal, Form, Select, Upload } from 'antd';
import post from '@/utils/request'
const { Search } = Input;
const { Option } = Select;


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

    updatestatus = (id_list,value) => { // done
        // [1,2,3] 全部false  - 服务端处理
        // [1] 这种看情况
        post('/backstage/house/updatestatus', { id_list: id_list,value:value }).then(res => {
            message.success("更新成功")
            this.get()
        })
    }


    delete = id => {//刪 done
        post('/backstage/house/delete', { id: id }).then(res => {
            message.success("刪除成功")
            this.get()
        })
    }

    get = () => {//查 done
        var params = this.state.params
        params = Object.assign(params, { pagesize: this.state.pagination.pageSize, current: this.state.pagination.current })
        post('/backstage/house/get', params).then(res => {
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
                title: "",
                rent: 1000,
                housetype: 0,
                style: 0,
                orientation: 0,
                floor: 1,
                area: 20,
                renovation: 0,
                deposit: 1,
                startrent: 1,
                matching: "",
                description: "",
                region: 0,
                addr: "",
                img_list: [],
                status: 0,
            }
        }
        this.updateeditmodal({ type: type, visible: true, data: record })
    }



    readmultifiles = files => new Promise((resolve, reject) => {
        let reader = new FileReader();
        let fileList = []
        function readFile(index) {
            if (index >= files.length) return resolve(fileList);
            let file = files[index];
            reader.onloadend = function (e) {
                // get file content  
                // let bin = e.target.result;
                fileList.push(e.target.result)
                // do sth with bin
                readFile(index + 1)
            }
            reader.readAsDataURL(file);
        }
        readFile(0);
    })

    editmodalhandleOk = (record) => {//确认

        // record.img_list_tmp = []
        // 处理base64图片
        // const reader = new FileReader();
        if (record.img_list.fileList) {
            let files = record.img_list.fileList.filter(el => el.originFileObj).map(el => el.originFileObj)
            this.readmultifiles(files).then(fileList => {
                let new_img_list = fileList.map(el => {
                    return { url: el }
                })
                let old_img_list = record.img_list.fileList.filter(el => el.url).map(el => {
                    return { url: el.url }
                })

                record.img_list = old_img_list.concat(new_img_list)
                this.updaterecord(record)
            })
        } else {
            this.updaterecord(record)
        }
    }

    updaterecord = record => {
        record.rent = parseInt(record.rent)
        record.area = parseInt(record.area)
        record.deposit = parseInt(record.deposit)
        record.housetype = parseInt(record.housetype)
        record.orientation = parseInt(record.orientation)
        record.region = parseInt(record.region)
        record.renovation = parseInt(record.renovation)
        record.startrent = parseInt(record.startrent)
        record.style = parseInt(record.style)
        record.floor = parseInt(record.floor)

        switch (this.state.editmodal.type) {
            case "create":
                post('/backstage/house/create', record).then(res => {
                    message.success("新增成功")
                    this.get()
                })
                break;
            case "edit":
                post('/backstage/house/update', record).then(res => {
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
                title: '标题',
                dataIndex: 'title',
                key: 'title',
                sorter: true
            },
            {
                title: '房东',
                dataIndex: 'landlord',
                key: 'landlord',
                sorter: true,
                render: text => text.name + text.mobile,
            },
            {
                title: '租金',
                dataIndex: 'rent',
                key: 'rent',
                sorter: true
            },
            {
                title: '户型',
                dataIndex: 'housetype',
                key: 'housetype',
                // ellipsis: true,
                sorter: true,
                render: text => this.state.options.housetype.filter(el => text === el[0])[0][1],
            },
            {
                title: '类型',
                dataIndex: 'style',
                key: 'style',
                sorter: true,
                render: text => this.state.options.style.filter(el => text === el[0])[0][1],
            },
            {
                title: '朝向',
                dataIndex: 'orientation',
                key: 'orientation',
                sorter: true,
                render: text => this.state.options.orientation.filter(el => text === el[0])[0][1],
            },
            // {
            //     title: '楼层',
            //     dataIndex: 'floor',
            //     key: 'floor',
            //     sorter: true,
            // },
            {
                title: '面积',
                dataIndex: 'area',
                key: 'area',
                ellipsis: true,
                sorter: true,
            },
            {
                title: '装修',
                dataIndex: 'renovation',
                key: 'renovation',
                ellipsis: true,
                sorter: true,
                render: text => this.state.options.renovation.filter(el => text === el[0])[0][1],
            },
            // {
            //     title: '押金(月)',
            //     dataIndex: 'deposit',
            //     key: 'deposit',
            //     ellipsis: true,
            //     sorter: true,
            // },
            // {
            //     title: '起租(月)',
            //     dataIndex: 'startrent',
            //     key: 'startrent',
            //     ellipsis: true,
            //     sorter: true,
            // },
            {
                title: '创建时间',
                dataIndex: 'create_at',
                key: 'create_at',
                ellipsis: true,
                sorter: true,
            },
            {
                title: '地区',
                dataIndex: 'region',
                key: 'region',
                ellipsis: true,
                sorter: true,
                render: text => this.state.options.region.filter(el => text === el[0])[0][1],
            },
            {
                title: '地址',
                dataIndex: 'addr',
                key: 'addr',
                ellipsis: true,
                // render: text => <Avatar src={text}></Avatar>,
            },
            {
                title: '浏览图',
                dataIndex: 'img_list',
                key: 'img_list',
                render: text => <Image
                    width={48}
                    height={48}
                    src={text.length > 0 ? text[0].url : ""}
                />,
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return (
                        <Select
                            defaultValue={text}
                            style={{ width: 96 }}
                            size="small"
                            onChange={(v) => { this.updatestatus([record.id], v) }}>
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
                        <Form.Item name="id" label="标识" hidden><Input type="number"/></Form.Item>
                        <Form.Item name="uuid" label="编号"><Input type="textarea" /></Form.Item>
                        <Form.Item name="title" label="标题"><Input type="textarea" /></Form.Item>
                        <Form.Item name="rent" label="租金"><Input  type="number" /></Form.Item>
                        <Form.Item name="housetype" label="户型">
                        <Select placeholder="选择">
                                {this.state.options.housetype.map(el => {
                                    return (<Option key={el[0]} value={el[0]}>{el[1]}</Option>)
                                })}
                            </Select>
                            </Form.Item>
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
                            </Upload></Form.Item>
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
                    {/* <Button onClick={() => { this.showeditmodal({}, "create") }} >新增房源</Button> */}
                    <Button onClick={() => { this.updatestatus(this.state.selectedRowKeys,0) }} danger >批量取消发布 </Button>
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
