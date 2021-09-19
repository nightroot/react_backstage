

export const actionType={
    SETTENANTUSER : "SET_TENANTUSER",//保存用户信息
    GETTENANTUSER : "GET_TENANTUSER",//获取用户信息
}


// state初始值
let initState = {
    id:0,
    username: '', // 用户名
    mobile: '', // 手机号
    token: '', // 登录凭证
    avatar: '', // 头像
}

// reducer
export function tenantuser(state=0,action) {
    switch (action.type) {
        case actionType.SETTENANTUSER:
            return action.data//保数据
        default:
            return state;
    }
}


// action
export function settenantuser(data) {
    return (dispatch,getState)=>{
        dispatch({
            type: actionType.SETTENANTUSER,
            data,
        })
    }
}