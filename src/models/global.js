import {queryNotices} from '@/services/user';
import _ from "lodash";

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    outgoingSpeedsCache: [] // 离岸点 消耗流量缓存
  },
  effects: {
    * fetchNotices(_, {call, put, select}) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    * clearNotices({payload}, {put, select}) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    * changeNoticeReadState({payload}, {put, select}) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = {...item};

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },

    * saveOutgoingSpeeds({payload}, {put, select}) {
      if (payload == null) return;
      const speedItemId = _.keys(payload.data)[0];
      const outgoingSpeedsCache = yield select(state => state.global.outgoingSpeedsCache);
      let isHave = false
      _.forEach(outgoingSpeedsCache, (item, index) => {
        const itemId = _.keys(item)[0]
        if (itemId === speedItemId) {
          outgoingSpeedsCache[index] = payload.data
          isHave =true;
        }
      })
      if(!isHave){
        outgoingSpeedsCache.push(payload.data)
      }
      yield put({
        type: 'saveOutgoingSpeedsCache',
        payload: {
          data: outgoingSpeedsCache
        },
      });
    },
  },
  reducers: {
    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      {payload},
    ) {
      return {...state, collapsed: payload};
    },

    saveNotices(state, {payload}) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      {payload},
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
    saveOutgoingSpeedsCache(state, {payload}) {
      return {...state, outgoingSpeedsCache: payload.data};
    },
  },
  subscriptions: {
    setup({history}) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({pathname, search}) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
export default GlobalModel;
