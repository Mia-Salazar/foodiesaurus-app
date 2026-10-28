import path from "node:path";

import { cleanup, renderRouter } from "expo-router/testing-library";

const appDirectory = path.join(__dirname, "../app");

describe("Given the app shell", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("When I open /, Then I see the home screen and fetch is not called", async () => {
    const view = await renderRouter(appDirectory, { initialUrl: "/" });

    expect(view.getByTestId("home-screen").props.accessibilityLanguage).toBe("es");
    expect(view.getPathname()).toBe("/");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("When I open /restaurants, Then I see the results screen and fetch is not called", async () => {
    const view = await renderRouter(appDirectory, { initialUrl: "/restaurants" });

    expect(view.getByTestId("results-screen").props.accessibilityLanguage).toBe("es");
    expect(view.getPathname()).toBe("/restaurants");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("When I open /restaurants/1, Then I see that restaurant route and fetch is not called", async () => {
    const view = await renderRouter(appDirectory, { initialUrl: "/restaurants/1" });

    expect(view.getByTestId("detail-screen").props.accessibilityLanguage).toBe("es");
    expect(view.getByText("1")).toBeTruthy();
    expect(view.getPathname()).toBe("/restaurants/1");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
