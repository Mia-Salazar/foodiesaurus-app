import path from "node:path";

import { userEvent, within } from "@testing-library/react-native";
import { cleanup, renderRouter } from "expo-router/testing-library";
import { Linking } from "react-native";

import { Restaurant } from "@/entities/restaurant/model/restaurant";

const appDirectory = path.join(__dirname, "../../../app");

const friki: Restaurant = {
  id: 24,
  name: "Friki Pizza",
  province: "Madrid",
  address: "Calle de Alcántara, 71",
  zip: "28006",
  phone: "910000000",
  foodType: "Pizza",
  score: 7,
};

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ data }),
  };
}

describe("Given Friki Pizza is in the results", () => {
  beforeEach(() => {
    jest.spyOn(Linking, "openURL").mockResolvedValue(undefined);
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("When they activate Ver Friki Pizza, Then that restaurant is shown", async () => {
    global.fetch = jest.fn(async (input: RequestInfo | URL) => {
      const url = new URL(String(input));
      if (url.pathname === "/api/restaurants/24") {
        return jsonResponse({
          id: 24,
          name: "Friki Pizza",
          province: "Madrid",
          address: "Calle de Alcántara, 71",
          zip: "28006",
          phone: "910000000",
          url: "https://ejemplo.test",
          foodType: "Pizza",
          averages: { general: 7.5, totalReviews: 2 },
        });
      }
      return jsonResponse([friki]);
    }) as unknown as typeof fetch;

    const view = await renderRouter(appDirectory, {
      initialUrl: "/restaurants?province=Madrid",
    });
    jest.useRealTimers();
    const user = userEvent.setup();
    await user.press(await view.findByRole("link", { name: "Ver Friki Pizza" }));

    const detail = within(view.getAllByTestId("detail-screen").at(-1)!);
    expect(await detail.findByRole("header", { name: "Friki Pizza" })).toBeTruthy();
    expect(detail.getByText("Madrid")).toBeTruthy();
    expect(detail.getByText("Datos del restaurante")).toBeTruthy();
    expect(detail.getByText("Calle de Alcántara, 71, 28006, Madrid")).toBeTruthy();
    expect(detail.getByText("Tipo de comida")).toBeTruthy();
    expect(detail.getByText("Pizza")).toBeTruthy();
    expect(detail.getByText("7,5")).toBeTruthy();
    expect(detail.getByText("/10")).toBeTruthy();
    expect(detail.getByText("2 opiniones")).toBeTruthy();

    const detailCall = (global.fetch as jest.Mock).mock.calls.find(([input]) =>
      String(input).includes("/api/restaurants/24"),
    );
    expect(detailCall).toBeTruthy();
    const url = new URL(String(detailCall[0]));
    expect(url.origin).toBe("http://localhost:3000");
    expect(url.pathname).toBe("/api/restaurants/24");

    await user.press(detail.getByRole("link", { name: "910000000" }));
    expect(Linking.openURL).toHaveBeenCalledWith("tel:910000000");

    await user.press(detail.getByRole("link", { name: "Visitar la web de Friki Pizza" }));
    expect(Linking.openURL).toHaveBeenCalledWith("https://ejemplo.test");
  });

  it("When the restaurant has one review, Then the count reads 1 opinión", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse({
        id: 8,
        name: "Casa",
        province: "Sevilla",
        address: "Calle Casa",
        averages: { general: 7, totalReviews: 1 },
      }),
    );

    const view = await renderRouter(appDirectory, { initialUrl: "/restaurants/8" });
    jest.useRealTimers();
    const detail = within(view.getByTestId("detail-screen"));

    expect(await detail.findByText("1 opinión")).toBeTruthy();
    expect(detail.queryByText("1 opiniones")).toBeNull();
    expect(detail.getByText("7")).toBeTruthy();
    expect(detail.getByText("/10")).toBeTruthy();
  });
});
