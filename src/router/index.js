import ConfigUserNewPassword from "@/views/ConfigUserNewPassword.vue";
import CreatePost from "@/views/CreatePost.vue";
import EmailConfirmation from "@/views/EmailConfirmation.vue";
import PreviewPost from "@/views/PreviewPost.vue";
import ResetUserPassword from "@/views/ResetUserPassword.vue";
import UserDashboard from "@/views/UserDashboard.vue";
import UserLogin from "@/views/UserLogin.vue";
import UserSignin from "@/views/UserSignin.vue";
import { createRouter, createWebHistory } from "vue-router";
import EditPost from "../views/EditPost.vue";
import HomePage from "../views/HomePage.vue";
import PostDetail from "../views/PostDetail.vue";

const routes = [
   { path: "/", component: HomePage },
   { path: "/post/:id", component: PostDetail },
   { path: "/edit/:id", component: EditPost },
   { path: "/dashboard", component: UserDashboard },
   { path: "/login", component: UserLogin },
   { path: "/signin", component: UserSignin },
   { path: "/create", component: CreatePost },
   { path: "/preview/:id", component: PreviewPost },
   { path: "/confirm-email", component: EmailConfirmation },
   { path: "/reset-password", component: ResetUserPassword },
   {
      path: "/config-new-password",
      component: ConfigUserNewPassword,
      name: "ConfigNewPassword",
   },
];

const router = createRouter({
   history: createWebHistory(),
   routes,
});

export default router;
