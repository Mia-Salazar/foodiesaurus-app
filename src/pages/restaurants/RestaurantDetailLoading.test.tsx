import path from "node:path";

import { act, within } from "@testing-library/react-native";
import { router } from "expo-router";
import { cleanup, renderRouter } from "expo-router/testing-library";

const appDirectory = path.join(__dirname, "../../../app");

type Pending = {
  resolve: (value: {
    ok: boolean;
    status: number;
    json: () => Promise<{ data: unknown }>;
  }) => void;
};

function jsonResponse(data: unknown) {
  return {
    ok: true,
    status: 200,
    json: async () => ({ data }),
  };
}

describe("Given a restaurant detail is requested", () => {
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

  it("When the detail is in flight, Then the screen shows Cargando el restaurante.", async () => {
    const view = await renderRouter(appDirectory, { initialUrl: "/restaurants/24" });
    jest.useRealTimers();
    const screen = () => within(view.getAllByTestId("detail-screen").at(-1)!);

    expect(await screen().findByText("Cargando el restaurante.")).toBeTruthy();
    expect(screen().getByLabelText("Cargando")).toBeTruthy();
    expect(screen().queryByText("Friki Pizza")).toBeNull();

    await act(async () => {
      pending.at(-1)?.resolve(
        jsonResponse({
          id: 24,
          name: "Friki Pizza",
          province: "Madrid",
          address: "Calle de Alcántara, 71",
          averages: { general: 7, totalReviews: 1 },
        }),
      );
    });

    expect(await screen().findByRole("header", { name: "Friki Pizza" })).toBeTruthy();
    expect(screen().queryByText("Cargando el restaurante.")).toBeNull();

    await act(async () => {
      router.push("/restaurants/8");
    });

    expect(screen().getByText("Cargando el restaurante.")).toBeTruthy();
    expect(screen().getByLabelText("Cargando")).toBeTruthy();
    expect(screen().queryByText("Friki Pizza")).toBeNull();
  });
});
