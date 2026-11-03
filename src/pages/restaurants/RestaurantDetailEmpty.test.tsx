import path from "node:path";

import { within } from "@testing-library/react-native";
import { cleanup, renderRouter } from "expo-router/testing-library";

const appDirectory = path.join(__dirname, "../../../app");

describe("Given a restaurant has no scores", () => {
  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("When it opens, Then the detail shows Sin puntuaciones todavía. and no opinion count", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          id: 3,
          name: "Casa Vacía",
          province: "Barcelona",
          address: "Carrer Buit",
          averages: null,
        },
      }),
    });

    const view = await renderRouter(appDirectory, { initialUrl: "/restaurants/3" });
    jest.useRealTimers();
    const detail = within(view.getByTestId("detail-screen"));

    expect(await detail.findByText("Sin puntuaciones todavía.")).toBeTruthy();
    expect(detail.getByRole("header", { name: "Casa Vacía" })).toBeTruthy();
    expect(detail.queryByText("/10")).toBeNull();
    expect(detail.queryByText("1 opinión")).toBeNull();
    expect(detail.queryByText(/opiniones/)).toBeNull();
  });
});
