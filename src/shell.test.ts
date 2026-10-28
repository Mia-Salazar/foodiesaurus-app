import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { getApiOrigin } from "@/api/config";
import { appLocale } from "@/shared/locale";
import { theme } from "@/shared/theme";

const projectRoot = path.join(__dirname, "..");

function sourceFiles(directory: string): string[] {
  const absolute = path.join(projectRoot, directory);
  return readdirSync(absolute).flatMap((entry) => {
    const fullPath = path.join(absolute, entry);
    if (statSync(fullPath).isDirectory()) {
      return sourceFiles(path.relative(projectRoot, fullPath));
    }
    if (!/\.(ts|tsx)$/.test(entry) || /\.test\.(ts|tsx)$/.test(entry)) {
      return [];
    }
    return [fullPath];
  });
}

describe("Given the app shell", () => {
  it("Then the root locale is Spanish", () => {
    expect(appLocale).toBe("es");
  });

  it("Then theme.ts holds the constitution colors", () => {
    expect(theme.color).toEqual({
      foodiesaurus: "#005c5c",
      foodiesaurusLight: "#317d65",
      foodiesaurusDark: "#1f3f35",
      secondary: "#8b3e14",
      secondaryLight: "#c1571a",
      secondaryDark: "#361309",
      background: "#ffffff",
      text: "#171717",
      focus: "#005c5c",
    });
    expect(theme.focusWidth).toBe(3);
    expect(theme.focusOffset).toBe(2);
    expect(theme.buttonMinHeight).toBe(44);
  });

  it("Then EXPO_PUBLIC_API_URL is the only API origin", () => {
    expect(getApiOrigin()).toBe("http://localhost:3000");

    const sources = [...sourceFiles("app"), ...sourceFiles("src")];
    for (const file of sources) {
      const text = readFileSync(file, "utf8");
      expect(text.includes("fetch(")).toBe(false);
      expect(text.includes("http://")).toBe(false);
      expect(text.includes("https://")).toBe(false);
    }
  });
});
