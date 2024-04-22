import axios from "@/axios";
import { useAccountStore } from '@/stores/account';
import { useApplicationStore } from '@/stores/application';
import { useNotificationStore } from '@/stores/notifications';
import { checkUserAuthentication } from "@/stores/services/accountService";
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    // component: () => import('@/layouts/FullPage.vue'),
    component: () => import('@/App.vue'),
    beforeEnter: (to, from, next) => {
      next('/dashboard');
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/dashboard/Logout.vue')
  },
  {
    path: '/dashboard',
    component: () => import('@/layouts/Dashboard.vue'),
    beforeEnter: (to, from, next) => {
      // Check if the user is currently authenticated with the back-end before allowing access
      // to any of the children routes

      const applicationStore = useApplicationStore();
      const accountStore = useAccountStore();
      const notificationStore = useNotificationStore();

      applicationStore.setApplicationLoadingState(true);
      checkUserAuthentication()
        .then(response => {
          // Parse the status code
          const responseCode = response.status;
          if (responseCode === 200) {
            next();
            accountStore.setAccountDetails(response.data);
            applicationStore.setApplicationLoadingState(false);
            window.localStorage.setItem("applyColumnState",JSON.stringify(response.data.col_def))
          } else if (responseCode === 401) {
            axios.post('/auth/refresh', {}, {
              withCredentials: true
            })
              .then(response => {
                if (response.status === 200) {
                  next();
                  applicationStore.setApplicationLoadingState(false);
                }
              }).catch(() => {
                'pass'

              })
          } else if (responseCode === 426) {
            notificationStore.addNotification({
              message: 'You need to upgrade your account!',
              type: 'danger'
            });
            next({
              name: 'Login'
            });
            applicationStore.setApplicationLoadingState(false);
          } else {
            notificationStore.addNotification({
              message: 'You need to login to access the dashboard!',
              type: 'danger'
            });
            next({
              name: 'Login'
            });
            applicationStore.setApplicationLoadingState(false);
          }

        })
        .catch(err => {
          notificationStore.addNotification({
            message: "You're not authenticated! Please login to continue",
            type: 'danger'
          })
          applicationStore.setApplicationLoadingState(false);
          next({
            name: 'Login'
          });
        });
    },
    children: [
      {
        path: 'new-articles',
        name: 'Articles',
        component: () => import("@/views/dashboard/articles/ArticlesDashboard.vue")
      },
      {
        path: 'create-rule',
        name: 'Create Rule',
        component: () => import("@/views/dashboard/articles/RuleMaster.vue")
      },
      {
        path: 'edit-rule/:id',
        name: 'Edit Rule',
        component: () => import("@/views/dashboard/articles/RuleMasterEdit.vue")
      },
      // {
      //   path: 'selection',
      //   name: 'section-Data',
      //   component: () => import("@/components/rules/Components/SelectionTest.vue")
      // },
      {
        path: 'rules/articles/:id',
        name: 'Rules-Articles',
        component: () => import("@/views/dashboard/articles/ArticlesDashboard.vue")
      },
      {
        path: 'test-articles',
        name: 'test',
        component: () => import("@/views/dashboard/articles/test.vue")
      },
      {
        path: 'agencies',
        name: 'Agencies',
        component: () => import('@/views/dashboard/agencies/agencies.vue')
      },
      {
        path: 'rules',
        name: 'Rules',
        component: () => import('@/views/dashboard/rules/Rules.vue')
      },
      {
        path: 'sectors',
        name: 'Sectors',
        component: () => import('@/views/dashboard/sector-types/sectorTypes.vue')
      },
      {
        path: 'manage-users',
        name: 'ManageUsers',
        component: () => import('@/views/dashboard/manage-users/manageUsers.vue')
      },
      {
        path: 'status',
        name: 'Status',
        component: () => import('@/views/dashboard/statuses/Statuses.vue')
      },
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/views/dashboard/tags/Tags.vue')
      },
      {
        path: 'classifications',
        name: 'Classifications',
        component: () => import('@/views/dashboard/classifications/Classifications.vue')
      },
      {
        path: 'federal-register-publications',
        name: 'FederalRegisterPublications',
        component: () => import('@/views/dashboard/federal-register-publications/FederalRegisterPublications.vue')
      },
      {
        path: 'filing-types',
        name: 'FilingTypes',
        component: () => import('@/views/dashboard/filing-types/FilingTypes.vue')
      },
      {
        path: 'alert-types',
        name: 'AlertTypes',
        component: () => import('@/views/dashboard/alertTypes/alert_types.vue')
      },
      {
        path: 'published-status',
        name: 'PublishedStatus',
        component: () => import('@/views/dashboard/alert-status/AlertStatus.vue')
      },
      {
        path: 'subType-classifications',
        name: 'SubtypeClassifications',
        component: () => import('@/views/dashboard/subtype-classifications/SubTypeClassifications.vue')
      },
      {
        path: 'higher-level-alert-classifications',
        name: 'higherlevelalertclassifications',
        component: () => import('@/views/dashboard/higher-level-alert-classifications/HigherLevelAlertClassifications.vue')
      },
      {
        path: 'states',
        name: 'States',
        component: () => import('@/views/dashboard/states/States.vue')
      },
      {
        path: 'articleTypes',
        name: 'ArticleTypes',
        component: () => import('@/views/dashboard/articleTypes/ArticleTypes.vue')
      },
      {
        path: 'find-and-replace',
        name: 'FindAndReplace',
        component: () => import('@/views/dashboard/FindAndReplace.vue')
      },
      {
        path: 'raw/articles',
        name: 'RawArticles',
        component: () => import('@/views/dashboard/raw/RawArticles.vue')
      },
      {
        path: 'editors/assigned-articles',
        name: 'AssignedArticles',
        component: () => import('@/views/dashboard/editors/AssignedArticles.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
