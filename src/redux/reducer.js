import {combineReducers} from 'redux'

import {backstageuser} from './backstage/user'
import {landlorduser} from './landlord/user'
import {tenantuser} from './tenant/user'

export default combineReducers({
    backstageuser,
    landlorduser,
    tenantuser
})