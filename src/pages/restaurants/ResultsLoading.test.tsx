import path from "node:path";

import { act, within } from "@testing-library/react-native";
import { router } from "expo-router";
import { cleanup, renderRouter } from "expo-router/testing-library";

import { Restaurant } from "@/entities/restaurant/model/restaurant";

const appDirectory = path.join(__dirname, "../../../app");

type Pending = {
  resolve: (value: { ok: boolean; json: () => Promise<{ data: Restaurant[] }> }) => void;
};

function jsonResponse(data: Restaurant[]) {
  return {
    ok: true,
    json: async () => ({ data }),
  };
}

function restaurant(name: string, province: string): Restaurant {
  return {
    id: name.length,
    name,
    province,
    address: `Calle ${name}`,
  };
}

describe("Given the results for a province", () => {
  const pending: Pending[] = [];

  beforeEach(() => {
    pending.length = 0;
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          pending.push({ resolve });
        }),
    );
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("When the search is in flight, Then the screen shows Buscando restaurantes. and hides the previous list", async () => {
    const view = await renderRouter(appDirectory, {
      initialUrl: "/restaurants?province=Madrid",
    });
    jest.useRealTimers();
    const screen = () => within(view.getAllByTestId("results-screen").at(-1)!);

    expect(await screen().findByText("Buscando restaurantes.")).toBeTruthy();
    expect(screen().getByLabelText("Cargando")).toBeTruthy();
    expect(screen().queryByText("Alfa")).toBeNull();
    expect(screen().queryByText("1 restaurante")).toBeNull();

    await act(async () => {
      pending.at(-1)?.resolve(jsonResponse([restaurant("Alfa", "Madrid")]));
    });

    expect(await screen().findByText("Alfa")).toBeTruthy();
    expect(screen().queryByText("Buscando restaurantes.")).toBeNull();

    await act(async () => {
      router.setParams({ province: "Barcelona" });
    });

    expect(screen().getByText("Buscando restaurantes.")).toBeTruthy();
    expect(screen().getByLabelText("Cargando")).toBeTruthy();
    expect(screen().queryByText("Alfa")).toBeNull();
    expect(screen().queryByText("1 restaurante")).toBeNull();

    await act(async () => {
      pending.at(-1)?.resolve(jsonResponse([restaurant("Beta", "Barcelona")]));
    });

    expect(await screen().findByText("Beta")).toBeTruthy();
    expect(screen().queryByText("Alfa")).toBeNull();
    expect(screen().queryByText("Buscando restaurantes.")).toBeNull();
  });
});
