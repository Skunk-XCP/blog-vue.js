import router from "@/router/index";
import HomePage from "@/views/HomePage.vue";
import PostDetail from "@/views/PostDetail.vue";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";

describe("Router", () => {
  let routerInstance;

  beforeEach(() => {
    // Créer une instance de router avant chaque test
    routerInstance = createRouter({
      history: createWebHistory(),
      routes: router.options.routes,
    });
  });

  it("navigates to HomePage correctly", async () => {
    routerInstance.push("/");
    await routerInstance.isReady();

    const wrapper = mount(HomePage, {
      global: {
        plugins: [routerInstance],
      },
    });

    expect(wrapper.html()).toContain("HomePage");
  });

  it("navigates to PostDetail correctly with dynamic ID", async () => {
    routerInstance.push("/post/1");
    await routerInstance.isReady();

    const wrapper = mount(PostDetail, {
      global: {
        plugins: [routerInstance],
      },
    });

    expect(wrapper.html()).toContain("PostDetail");
  });

  it("navigates to CreatePost page", async () => {
    routerInstance.push("/create");
    await routerInstance.isReady();

    const wrapper = mount(CreatePost, {
      global: {
        plugins: [routerInstance],
      },
    });

    expect(wrapper.html()).toContain("Créer un Nouvel Article");
  });
});
