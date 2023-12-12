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
            path: '/contact',
            name: 'contact',
            component: () => import('../views/aboutUs.vue'),
            meta: {requiresAuth: false}
        },
        {
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
                    path: 'categories',
                    name: 'categories',
                    component: () => import('../views/admin/categories/categoriesList.vue'),
                },
                {
                    path: 'staff',
                    name: 'staff',
                    component: () => import('../views/admin/staff/staffList.vue'),
                },
                {
                    path: 'clients',
                    name: 'clients',
                    component: () => import('../views/admin/clients/clientsList.vue'),
                },
                {
                    path: 'products',
                    name: 'products',
                    component: () => import('../views/admin/products/productsList.vue'),
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
                },
                {
                    path: 'sales',
                    name: 'sales',
                    component: () => import('../views/employ/products/sellProduct.vue'),
                }, {
                    path: 'clients',
                    name: 'clients',
                    component: () => import('../views/admin/clients/clientsList.vue'),
                }, {
                    path: 'providersProduct',
                    name: 'providersProductAdmin',
                    component: () => import('../views/admin/providersProducts/providerProductsUser.vue'),
                },
                {
                    path: 'categories',
                    name: 'categories',
                    component: () => import('../views/admin/categories/categoriesList.vue'),
                },
                {
                    path: 'products',
                    name: 'products',
                    component: () => import('../views/admin/products/productsList.vue'),
                },
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
            next('/');
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
