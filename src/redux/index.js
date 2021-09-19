
// 首先导入redux的一些方法
import { createStore, compose, applyMiddleware } from 'redux';
// 还使用了thunk，还没来的及去研究，这里先使用吧
import thunk from 'redux-thunk';
// 引入redux-persist
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage'
// 将我们的合并后的reducer引入
import Reducers from './reducer';
// 首先定义一个对象（按官方文档来的，没具体研究）
const persistConfig = {
    key: 'root',
    storage,
};
// 使用redux-persist合并
const persistedReducer = persistReducer(persistConfig, Reducers)
// 定义一个函数，返回persistor和store，让我的组件使用

// 这里我使用了thunk，具体原理我也没去细研究，使用redux的createStore去合并，最终产出我们需要传入Provider的store
let store = createStore(persistedReducer, compose(
    applyMiddleware(thunk), //解决redux异步问题
    window.devToolsExtension ? window.devToolsExtension() : f => f // chrome控制台redux工具
));
// 这里就是应用redux-persist以完成数据持久化
let persistor = persistStore(store);


export { persistor, store }
