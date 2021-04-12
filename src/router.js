import Vue from 'vue'
import store from '@/store.js'
import Router from 'vue-router'

import ComicList from '@/pages/ComicList.vue'
import Comic from '@/pages/comic/Comic.vue'
import About from '@/pages/About.vue'
import Artist from '@/pages/Artist.vue'
import Admin from '@/pages/Admin.vue'
import PendingComic from '@/pages/PendingComic.vue'
import Account from '@/pages/account/Account.vue'
import Feedback from '@/pages/Feedback.vue'
import SuggestComic from '@/pages/SuggestComic.vue'
import Blog from '@/pages/Blogs.vue'
import Advertising from '@/pages/Advertising.vue'
import Advertising2 from '@/pages/Advertising2.vue'
import AdvertisingApply from '@/pages/AdvertisingApply.vue'
import JoinUs from '@/pages/JoinUs.vue'
import JoinUsApply from '@/pages/JoinUsApply.vue'
import ResetPassword from '@/pages/ResetPassword.vue'
import AdsDashboard from '@/pages/AdvertisingDashboard.vue'

Vue.use(Router)

async function rerouteIfNotLoggedIn(to, from, next) {
  try {
    let isLoggedIn = await store.dispatch('checkAndSetLoginStatus')
    if (isLoggedIn) {
      next()
    }
    else {
      next({ name: 'comicList' })
    }
  }
  catch (err) {
    next({ name: 'comicList' })
  }
}

async function rerouteIfLoggedIn(to, from, next) {
  try {
    let isLoggedIn = await store.dispatch('checkAndSetLoginStatus')
    if (!isLoggedIn) {
      next()
    }
    else {
      next({ name: 'comicList' })
    }
  }
  catch (err) {
    next({ name: 'comicList' })
  }
}

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'comicList',
      component: ComicList,
      meta: {
        reloadOnLogin: true,
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/artist/:artistName',
      name: 'artist',
      component: Artist,
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/account',
      name: 'account',
      component: Account,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/suggestcomic',
      name: 'suggestComic',
      component: SuggestComic,
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: Feedback,
    },
    {
      path: '/join-us',
      name: 'joinUs',
      component: JoinUs,
    },
    {
      path: '/join-us-apply',
      name: 'joinUsApply',
      component: JoinUsApply,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/blog/:id',
      name: 'blogWithId',
      component: Blog,
    },
    {
      path: '/blog',
      name: 'blog',
      component: Blog,
    },
    {
      path: '/advertising',
      name: 'advertising',
      component: Advertising,
    },
    {
      path: '/advertising2',
      name: 'advertising2',
      component: Advertising2,
    },
    {
      path: '/advertising-apply',
      name: 'apply-advertising',
      component: AdvertisingApply,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/join-us',
      name: 'moderating',
      component: Blog,
    },
    {
      path: '/pendingComics/:comicName',
      name: 'pendingComic',
      component: PendingComic,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/reset-password-link/:token',
      name: 'resetPassword',
      component: ResetPassword,
      beforeEnter: rerouteIfLoggedIn,
    },
    {
      path: '/ads-dashboard',
      name: 'adsDashboard',
      component: AdsDashboard,
      beforeEnter: rerouteIfNotLoggedIn,
      meta: {
        redirectOnLogout: true,
      }
    },
    {
      path: '/:comicName',
      name: 'comic',
      component: Comic,
      meta: {
        reloadOnLogin: true,
      }
    },
  ],
  scrollBehavior ( to, from, savedPosition ) {
    if (to.path === '/' && from.path === '/') { return }
    if (to.path.includes('blog') && from.path.includes('blog')) { return }
    if ( savedPosition ) { return savedPosition }
    else { return {x: 0, y: 0} }
  }
})
