

export const actionType={
    SETBACKSTAGEUSER : "SET_BACKSTAGEUSER",//保存用户信息
    GETBACKSTAGEUSER : "GET_BACKSTAGEUSER",//获取用户信息
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
export function backstageuser(state=0,action) {
    switch (action.type) {
        case actionType.SETBACKSTAGEUSER:
            return action.data//保数据
        default:
            return state;
    }
}


// action
export function setbackstageuser(data) {
    return (dispatch,getState)=>{
        dispatch({
            type: actionType.SETBACKSTAGEUSER,
            data,
        })
    }
}