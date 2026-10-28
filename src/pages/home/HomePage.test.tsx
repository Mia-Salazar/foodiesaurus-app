import { render } from "@testing-library/react-native";

import { HomePage } from "./HomePage";

describe("Given the home search", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("When the screen renders, Then Rita, the form, and no request are shown", async () => {
    const view = await render(<HomePage />);

    expect(
      view.getByRole("header", {
        name: "¡El meteorito no me extinguió, pero unas gambas casi lo hacen!",
      }),
    ).toBeTruthy();
    expect(
      view.getByRole("image", { name: "Rita, la dinosaurita, comiendo pizza" }),
    ).toBeTruthy();
    expect(view.getByRole("header", { name: "Busca un restaurante" })).toBeTruthy();

    const name = view.getByLabelText("Nombre");
    expect(name.props.value).toBe("");
    expect(name.props.maxLength).toBe(40);
    expect(name.props.placeholder).toBe("Ejemplo: Friki Pizza");
    expect(view.queryByLabelText("Ejemplo: Friki Pizza")).toBeNull();
    expect(view.getByText("Nombre")).toBeTruthy();
    expect(
      view.getByText("Nombre del restaurante. Si no lo sabes, déjalo vacío."),
    ).toBeTruthy();

    expect(view.getByText("Provincia")).toBeTruthy();
    expect(
      view.getAllByRole("radio").map((choice) => choice.props.accessibilityLabel),
    ).toEqual(["Barcelona", "Madrid", "Sevilla"]);
    expect(view.getByRole("radio", { name: "Madrid" }).props.accessibilityState).toEqual({
      selected: true,
    });
    expect(
      view.getByText("Elige la zona. Ahora hay Madrid, Barcelona y Sevilla."),
    ).toBeTruthy();
    expect(view.getByRole("button", { name: "Buscar" })).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
