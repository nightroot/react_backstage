import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import loginComponent from '@/view/backstage/login'//登录
import IndexComponent from '@/view/backstage/index'; // 模板页面
import homeComponent from '@/view/backstage/home'; // 主页
import landlordComponent from '@/view/backstage/user/landlord'; //房东管理
import tenantComponent from '@/view/backstage/user/tenant';//租客管理
import houseComponent from '@/view/backstage/house/info';//房源管理
import orderComponent from '@/view/backstage/order/house';//订单管理
import collectionComponent from '@/view/backstage/collection/house';//订单管理




// 菜单路由,配置
export const backstagemenu = [
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
        title: '用户管理',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
        children: [{
            path: '/user/landlord',
            title: '房东管理',
            component: landlordComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        },
        {
            path: '/user/tenant',
            title: '租客管理',
            component: tenantComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        }]
    },
    {
        path: '/evaluate',
        title: '评价管理',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
        children: [{
            path: '/evaluate/house',
            title: '房源评价',
            component: IndexComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        }]
    },
    {
        path: '/collection',
        title: '收藏管理',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
        children: [{
            path: '/collection/house',
            title: '房源收藏',
            component: collectionComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        }]
    },
    {
        path: '/order',
        title: '订单管理',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
        children: [{
            path: '/order/house',
            title: '租房订单',
            component: orderComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        }]
    },
    {
        path: '/house',
        title: '房源管理',
        component: IndexComponent,
        exact: true,
        isShow: true,
        icon: 'user',
        children: [{
            path: '/house/info',
            title: '房源信息',
            component: houseComponent,
            exact: true,
            isShow: true,
            icon: 'user',
        }]
    }
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
                    // component={route.component}
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
    return (
        <IndexComponent>
            <Switch>
                {/* 默认展示主页 */}
                {/* <Route path="/" exact component={homeComponent} /> */}
                {menuRoutes(backstagemenu, props.match)}
            </Switch>
        </IndexComponent>
    )
}

// 状态路由
// 认证路由
// 404路由
const backstageRouter = ({ match }) => (
    <Switch>
        <Route path={`${match.path}/login`} exact component={loginComponent} />
        <Route path={`${match.path}`} component={IndexRouter} />
        <Redirect to='/404' />
    </Switch>
);

export default backstageRouter