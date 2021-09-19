import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import loginComponent from '@/view/tenant/login'//登录
import IndexComponent from '@/view/tenant/index'; // 模板页面
import homeComponent from '@/view/tenant/home'; // 管理主页

import mainComponent from '@/view/tenant/main' //主页
import searchComponent from '@/view/tenant/search' //搜索
import housedetailComponent from '@/view/tenant/housedetail' //搜索
import myorderComponent from '@/view/tenant/order/house' //我的订单
import orderComponent from '@/view/tenant/order' //我的订单
import mycollectionComponent from '@/view/tenant/collection/collection' //我的收藏



// 菜单路由,配置
export const tenantmenu = [
    {
        path: '/home',
        title: '主页',
        component: homeComponent,
        exact: true,    //是否精准匹配：末端需要精准匹配
        isShow: true,   //是否显示：默认否
        icon: 'user',   //菜单配置项图标
    },
    {
        path: '/user',
        title: '个人中心',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
    },
    {
        path: '/collection',
        title: '我的收藏',
        component: mycollectionComponent,
        exact: true,
        isShow: true,
        icon: 'user',
    },
    {
        path: '/myorder',
        title: '我的订单',
        component: myorderComponent,
        exact: true,
        isShow: true,
        icon: 'user',
    },
    {
        path: '/msg',
        title: '消息列表',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
    },
];


//工具类，转换路由配置为路由实例
const menuRoutes = function (nodes, match) {
    // return getRoute(menu,match)
    var routes = []
    nodes.forEach(route => {
        if (route.children === undefined) {
            // 保存本身
            var temproute = (
                <Route
                    key={match.path + route.path}
                    path={match.path + route.path}
                    exact={route.exact}
                    component={route.component}
                    render={routeProps => {
                        return <route.component {...routeProps} />;
                    }}
                ></Route>
            )
            routes.push(temproute)
        }
        else {
            // 调用自身
            routes = routes.concat(menuRoutes(route.children, match))
        }
    });
    return routes
};


// 管理页面路由
const IndexRouter = (props) => {
    // console.log("parents:" + props.location.pathname)
    return (
        <IndexComponent>
            <Switch>
                {/* 默认展示主页 */}
                {/* <Route path="/" exact component={homeComponent} /> */}
                {menuRoutes(tenantmenu, props.match)}
            </Switch>
        </IndexComponent>
    )
}

// 状态路由
// 认证路由
// 404路由
const tenantRouter = ({ match }) => (
    <Switch>
        <Route path={`${match.path}`} exact component={mainComponent} />
        <Route path={`${match.path}/search`} component={searchComponent} />
        <Route path={`${match.path}/housedetail/:id`} component={housedetailComponent} />
        <Route path={`${match.path}/order/:id`} component={orderComponent} />
        <Route path={`${match.path}/login`} exact component={loginComponent} />
        <Route path={`${match.path}`} component={IndexRouter} />
        <Redirect to='/404' />
    </Switch>
);

export default tenantRouter