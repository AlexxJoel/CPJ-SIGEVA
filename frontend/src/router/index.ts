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
            meta: {requiresAuth: true, role: 'Admin'},
            component: () => import('../views/admin/component/AdminLayout.vue'),
            children: [
                {
                    path: 'home',
                    name: 'homeAdmin',
                    component: () => import('../views/admin/home/Home.vue'),
                }, {
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
        }, {
            path: '/employ/',
            name: 'employ',
            meta: {requiresAuth: true, role: 'Empleado'},
            component: () => import('../views/employ/component/EmployLayout.vue'),
            children: [
                {
                    path: 'home',
                    name: 'homeEmploy',
                    component: () => import('../views/employ/home/Home.vue'),
                },
                {
                    path: ":pathMatch(.*)*",
                    name: "NotFound",
                    component: () => import("../components/NotFound.vue")
                }
            ],
        }
        /* {
             path: "/:pathMatch(.*)*",
             name: "NotFound",
             component: () => import("../components/NotFound.vue")
         }*/
    ]
})

router.beforeEach((to, from, next) => {
    const token = localStorage?.token;
    const role = localStorage?.role;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            next('/login');
        } else {
            if (to.meta.role && to.meta.role !== role) {
                if (role === 'Admin') {
                    next('/admin/home');
                } else if (role === 'Empleado') {
                    next('/employ/home');
                }
            } else {
                next();
            }
        }
    }

    next();


})


export default router
