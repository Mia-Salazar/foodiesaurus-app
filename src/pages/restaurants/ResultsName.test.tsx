import path from "node:path";

import { userEvent, within } from "@testing-library/react-native";
import { cleanup, renderRouter } from "expo-router/testing-library";

import { Restaurant } from "@/entities/restaurant/model/restaurant";

const appDirectory = path.join(__dirname, "../../../app");

function jsonResponse(data: Restaurant[]) {
  return {
    ok: true,
    json: async () => ({ data }),
  };
}

describe("Given the person searches in Madrid with the name '  Friki  '", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("When they press Buscar, Then the trimmed name is requested and shown", async () => {
    const data: Restaurant[] = [
      {
        id: 2,
        name: "Zeta",
        province: "Madrid",
        address: "Calle Zeta",
      },
      {
        id: 1,
        name: "Alfa",
        province: "Madrid",
        address: "Calle Alfa",
      },
    ];
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(data));

    const view = await renderRouter(appDirectory, { initialUrl: "/" });
    jest.useRealTimers();
    const user = userEvent.setup();
    await user.type(view.getByLabelText("Nombre"), "  Friki  ");
    await user.press(view.getByRole("button", { name: "Buscar" }));

    const results = within(view.getAllByTestId("results-screen").at(-1)!);
    expect(await results.findByText("Restaurantes que coinciden con Friki")).toBeTruthy();
    expect(results.getByLabelText("Nombre").props.value).toBe("Friki");
    expect(results.getByRole("header", { name: "Restaurantes en Madrid" })).toBeTruthy();
    expect(
      results
        .getAllByRole("link", { name: /^Ver / })
        .map((link) => link.props.accessibilityLabel),
    ).toEqual(["Ver Alfa", "Ver Zeta"]);
    expect(results.getByText("Calle Alfa")).toBeTruthy();
    expect(results.getByText("Calle Zeta")).toBeTruthy();

    const calls = (global.fetch as jest.Mock).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    for (const [input] of calls) {
      const url = new URL(String(input));
      expect(url.origin).toBe("http://localhost:3000");
      expect(url.pathname).toBe("/api/restaurants");
      expect(url.searchParams.get("province")).toBe("Madrid");
      expect(url.searchParams.get("term")).toBe("Friki");
      expect(url.searchParams.has("sort")).toBe(false);
    }
  });
});
