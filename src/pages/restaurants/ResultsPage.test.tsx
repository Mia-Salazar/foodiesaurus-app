import path from "node:path";

import { userEvent } from "@testing-library/react-native";
import { cleanup, renderRouter } from "expo-router/testing-library";

import { Restaurant } from "@/entities/restaurant/model/restaurant";

const appDirectory = path.join(__dirname, "../../../app");

function jsonResponse(data: Restaurant[]) {
  return {
    ok: true,
    json: async () => ({ data }),
  };
}

function expectProvinceRequest(province: string) {
  const calls = (global.fetch as jest.Mock).mock.calls;
  expect(calls.length).toBeGreaterThan(0);
  for (const [input] of calls) {
    const url = new URL(String(input));
    expect(url.origin).toBe("http://localhost:3000");
    expect(url.pathname).toBe("/api/restaurants");
    expect(url.searchParams.get("province")).toBe(province);
    expect(url.searchParams.has("term")).toBe(false);
    expect(url.searchParams.has("sort")).toBe(false);
  }
}

describe("Given the person is on the home search", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  describe("And the province is Madrid and the name is empty", () => {
    it("When they press Buscar, Then that province is listed by name without term or sort", async () => {
      const data: Restaurant[] = [
        {
          id: 2,
          name: "Ñora",
          province: "Madrid",
          address: "Calle de la Ñora",
          zip: "28002",
          phone: "910000000",
          foodType: "Pizza",
          score: 7.5,
        },
        {
          id: 1,
          name: "Ávila",
          province: "Madrid",
          address: "Calle de Ávila",
          score: 7,
        },
        {
          id: 3,
          name: "Beta",
          province: "Madrid",
          address: "Calle Beta",
        },
      ];
      global.fetch = jest.fn().mockResolvedValue(jsonResponse(data));

      const view = await renderRouter(appDirectory, { initialUrl: "/" });
      jest.useRealTimers();
      const user = userEvent.setup();
      await user.press(view.getByRole("button", { name: "Buscar" }));

      expect(await view.findByText("3 restaurantes")).toBeTruthy();
      expectProvinceRequest("Madrid");
      expect(view.getByRole("header", { name: "Restaurantes en Madrid" })).toBeTruthy();
      expect(view.getByText("Calle de Ávila")).toBeTruthy();
      expect(view.getByText("Calle Beta")).toBeTruthy();
      expect(view.getByText("Calle de la Ñora")).toBeTruthy();
      expect(view.getByText("28002")).toBeTruthy();
      expect(view.getByText("Pizza")).toBeTruthy();
      expect(view.getByText("910000000")).toBeTruthy();
      expect(view.getByText("7")).toBeTruthy();
      expect(view.getByText("7,5")).toBeTruthy();
      expect(view.getAllByText("/10")).toHaveLength(2);
      expect(view.getByText("Sin puntuación")).toBeTruthy();
      expect(
        view
          .getAllByRole("link", { name: /^Ver / })
          .map((link) => link.props.accessibilityLabel),
      ).toEqual(["Ver Ávila", "Ver Beta", "Ver Ñora"]);
    });
  });

  it("When they search Barcelona with an empty name, Then one restaurant uses the singular count", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse([
        {
          id: 4,
          name: "Casa Barcelona",
          province: "Barcelona",
          address: "Carrer de Barcelona",
          score: 8,
        },
      ]),
    );

    const view = await renderRouter(appDirectory, { initialUrl: "/" });
    jest.useRealTimers();
    const user = userEvent.setup();
    await user.press(view.getByRole("button", { name: "Madrid" }));
    await user.press(view.getByRole("radio", { name: "Barcelona" }));
    await user.press(view.getByRole("button", { name: "Buscar" }));

    expect(await view.findByText("1 restaurante")).toBeTruthy();
    expect(view.queryByText("1 restaurantes")).toBeNull();
    expectProvinceRequest("Barcelona");
    expect(view.getByRole("header", { name: "Restaurantes en Barcelona" })).toBeTruthy();
    expect(view.getByRole("link", { name: "Ver Casa Barcelona" })).toBeTruthy();
  });

  it("When they search Sevilla with an empty name, Then the request uses that province only", async () => {
    global.fetch = jest.fn().mockResolvedValue(
      jsonResponse([
        {
          id: 5,
          name: "Alfa",
          province: "Sevilla",
          address: "Calle Alfa",
        },
        {
          id: 6,
          name: "Beta",
          province: "Sevilla",
          address: "Calle Beta Sevilla",
        },
      ]),
    );

    const view = await renderRouter(appDirectory, { initialUrl: "/" });
    jest.useRealTimers();
    const user = userEvent.setup();
    await user.press(view.getByRole("button", { name: "Madrid" }));
    await user.press(view.getByRole("radio", { name: "Sevilla" }));
    await user.press(view.getByRole("button", { name: "Buscar" }));

    expect(await view.findByText("2 restaurantes")).toBeTruthy();
    expectProvinceRequest("Sevilla");
    expect(view.getByRole("header", { name: "Restaurantes en Sevilla" })).toBeTruthy();
    expect(view.getByText("Calle Alfa")).toBeTruthy();
    expect(view.getByText("Calle Beta Sevilla")).toBeTruthy();
  });
});
