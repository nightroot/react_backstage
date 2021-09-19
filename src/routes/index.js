import React from 'react';
import { BrowserRouter as Router, Switch, Route,  useParams ,Redirect} from 'react-router-dom';
import { createHashHistory } from "history";

// 一级路由
import backstage from './backstage';
import landlord from './landlord';
import tenant from './tenant';
import indexComponent from '@/view/index'

const history = createHashHistory();

class RouterConfig extends React.Component {
    render(){
        return(
            <Router>
            {/* <Router history={history}> */}
                <Switch>
                    <Route path="/" exact component={indexComponent}></Route>
                    <Route path="/backstage" component={backstage}></Route>
                    {/* <Route path="/landlord" component={landlord}></Route>
                    <Route path="/tenant" component={tenant}></Route> */}
                    {/* <Redirect to='/404'/> */}
                </Switch>
            </Router>
        )
    }
};

export default RouterConfig;