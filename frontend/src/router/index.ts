import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'login',
            component: () => import('../views/auth/Login.vue'),
            meta: {requiresAuth: false}
        }, {
            path: '/admin/',
            name: 'admin',
            meta: {requiresAuth: true},
            component: () => import('../views/admin/component/AdminLayout.vue'),
            children: [
                {
                    path: 'home',
                    name: 'homeAdmin',
                    component: () => import('../views/admin/home/Home.vue'),
                },{
                    path: 'providersProduct',
                    name: 'providersProductAdmin',
                    component: () => import('../views/admin/providersProducts/providerProductsUser.vue'),
                },
                {
                    path: ":pathMatch(.*)*",
                    name: "NotFound",
                    component: () => import("../components/NotFound.vue")
                }
            ],
        },
       /* {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: () => import("../components/NotFound.vue")
        }*/
    ]
})

router.beforeEach((to, from, next) => {
    console.log(to);
    return next()
})


export default router
