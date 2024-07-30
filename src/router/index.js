import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../components/HomePage.vue";
import PostDetail from "../components/PostDetail.vue";

const routes = [
   { path: "/", component: HomePage },
   { path: "/post/:id", component: PostDetail },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

export default router;
