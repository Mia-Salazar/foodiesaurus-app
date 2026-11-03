import path from "node:path";

import { act, fireEvent, userEvent, within } from "@testing-library/react-native";
import { router } from "expo-router";
import { cleanup, renderRouter } from "expo-router/testing-library";

import { Restaurant } from "@/entities/restaurant/model/restaurant";

const appDirectory = path.join(__dirname, "../../../app");

const choices = [
  "Nombre",
  "Puntuación: de más alta a más baja",
  "Puntuación: de más baja a más alta",
];

function jsonResponse(data: Restaurant[]) {
  return {
    ok: true,
    json: async () => ({ data }),
  };
}

function cardNames(screen: ReturnType<typeof within>): string[] {
  return screen
    .getAllByRole("link", { name: /^Ver / })
    .map((link) => link.props.accessibilityLabel);
}

function sortControl(screen: ReturnType<typeof within>) {
  return screen.getByLabelText("Ordenar");
}

function choiceLabels(control: ReturnType<typeof sortControl>): string[] {
  if (Array.isArray(control.props.items)) {
    return control.props.items.map((item: { label: string }) => item.label);
  }
  return [];
}

function selectedSort(control: ReturnType<typeof sortControl>): string {
  if (typeof control.props.selectedValue === "string") {
    return control.props.selectedValue;
  }
  const items = control.props.items as { value: string }[];
  return items[control.props.selectedIndex ?? 0]?.value;
}

async function choose(control: ReturnType<typeof sortControl>, value: string) {
  if (control.props.onValueChange) {
    await act(async () => {
      control.props.onValueChange(value, 0);
    });
    return;
  }
  const items = control.props.items as { value: string }[];
  await act(async () => {
    fireEvent(control, "onChange", {
      nativeEvent: {
        newValue: value,
        newIndex: items.findIndex((item) => item.value === value),
      },
    });
  });
}

describe("Given the results contain at least two restaurants", () => {
  const data: Restaurant[] = [
    { id: 2, name: "Beta", province: "Madrid", address: "Calle Beta", score: 4 },
    { id: 5, name: "Ñora", province: "Madrid", address: "Calle Ñora", score: 9 },
    { id: 4, name: "Índigo", province: "Madrid", address: "Calle Índigo", score: 9 },
    { id: 3, name: "Zeta", province: "Madrid", address: "Calle Zeta" },
    { id: 1, name: "Hotel", province: "Madrid", address: "Calle Hotel", score: 9 },
  ];

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue(jsonResponse(data));
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
  });

  it("When they sort, Then the route keeps that order with the province and the name", async () => {
    const view = await renderRouter(appDirectory, { initialUrl: "/" });
    jest.useRealTimers();
    const user = userEvent.setup();
    await user.type(view.getByLabelText("Nombre"), "Friki");
    await user.press(view.getByRole("button", { name: "Buscar" }));

    const screen = () => within(view.getAllByTestId("results-screen").at(-1)!);
    expect(await screen().findByRole("link", { name: "Ver Beta" })).toBeTruthy();

    const control = sortControl(screen());
    expect(screen().getByText("Ordenar")).toBeTruthy();
    expect(choiceLabels(control)).toEqual(choices);
    expect(selectedSort(control)).toBe("name");
    expect(cardNames(screen())).toEqual([
      "Ver Beta",
      "Ver Hotel",
      "Ver Índigo",
      "Ver Ñora",
      "Ver Zeta",
    ]);

    const callsBeforeSort = (global.fetch as jest.Mock).mock.calls.length;
    await choose(control, "score-desc");

    expect((global.fetch as jest.Mock).mock.calls.length).toBe(callsBeforeSort);
    expect(cardNames(screen())).toEqual([
      "Ver Hotel",
      "Ver Índigo",
      "Ver Ñora",
      "Ver Beta",
      "Ver Zeta",
    ]);
    expect(view.getSearchParams()).toMatchObject({
      province: "Madrid",
      term: "Friki",
      sort: "score-desc",
    });

    await act(async () => {
      router.push("/");
    });
    await act(async () => {
      router.push("/restaurants?province=Madrid&term=Friki&sort=score-desc");
    });

    expect(await screen().findByRole("link", { name: "Ver Hotel" })).toBeTruthy();
    expect(cardNames(screen())).toEqual([
      "Ver Hotel",
      "Ver Índigo",
      "Ver Ñora",
      "Ver Beta",
      "Ver Zeta",
    ]);
    expect(selectedSort(sortControl(screen()))).toBe("score-desc");

    await choose(sortControl(screen()), "score-asc");
    expect(cardNames(screen())).toEqual([
      "Ver Beta",
      "Ver Hotel",
      "Ver Índigo",
      "Ver Ñora",
      "Ver Zeta",
    ]);
    expect(view.getSearchParams()).toMatchObject({
      province: "Madrid",
      term: "Friki",
      sort: "score-asc",
    });

    await choose(sortControl(screen()), "name");
    expect(cardNames(screen())).toEqual([
      "Ver Beta",
      "Ver Hotel",
      "Ver Índigo",
      "Ver Ñora",
      "Ver Zeta",
    ]);
    expect(view.getSearchParams().province).toBe("Madrid");
    expect(view.getSearchParams().term).toBe("Friki");
    expect(view.getSearchParams().sort).toBeUndefined();

    for (const [input] of (global.fetch as jest.Mock).mock.calls) {
      const url = new URL(String(input));
      expect(url.searchParams.has("sort")).toBe(false);
    }
  });
});
