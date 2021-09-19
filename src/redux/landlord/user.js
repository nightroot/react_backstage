

export const actionType={
    SETLANDLORDUSER : "SET_LANDLORDUSER",//保存用户信息
    GETLANDLORDUSER : "GET_LANDLORDUSER",//获取用户信息
}


// state初始值
let initState = {
    id:0,
    username: '', // 用户名
    mobile: '', // 手机号
    token: '', // 登录凭证
    avatar: '', // 头像
    isLogin: false // 是否登录
}

// reducer
export function landlorduser(state=0,action) {
    switch (action.type) {
        case actionType.SETLANDLORDUSER:
            return action.data//保数据
        default:
            return state;
    }
}


// action
export function setlandlorduser(data) {
    return (dispatch,getState)=>{
        dispatch({
            type: actionType.SETLANDLORDUSER,
            data,
        })
    }
}