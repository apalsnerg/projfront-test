export const getUserColor = (activeUsers, username) => {
  return activeUsers[username]?.color;
};

const stringToHash = (str) => {
  let hash = 0;
  for (const char of str) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  return hash;
};

export const usernameToHSL = (username, existingColors, saturation = "100%", luminance = "70%") => {
  const hash = stringToHash(username);

  let hue = Math.abs(hash) % 360;
  let returnString = `hsl(${hue} ${saturation} ${luminance})`;

  // if we find that our generated color already exists, shift it a bit and see if that one isn't taken
  while (existingColors.includes(returnString)) {
    hue *= 7;
    returnString = `hsl(${hue % 360} ${saturation} ${luminance})`;
  }

  return returnString;
};

/**
 * Converts an HSL color representation into RGB format. Based on HSL to RGB algorithim found on [Wikipedia](https://en.wikipedia.org/wiki/HSL_and_HSV#HSL_to_RGB).
 *
 * @param {number} hue
 * @param {number} sat
 * @param {number} lum
 */
const hslToRgb = (hue, sat, lum) => {
  // the formula requires these to between 0 and 1
  sat = sat * 0.01;
  lum = lum * 0.01;

  const k = (n) => {
    return (n + hue / 30) % 12;
  };

  const a = () => {
    return sat * Math.min(lum, 1 - lum);
  };

  const triangleConvert = (n) => {
    return lum - a() * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  };

  const R = Math.floor(Math.abs(triangleConvert(0) * 255));
  const G = Math.floor(Math.abs(triangleConvert(8) * 255));
  const B = Math.floor(Math.abs(triangleConvert(4) * 255));

  return [R, G, B];
};

/**
 * Converts a HSL color representation into a Hexadecimal representation of the same color
 *
 * @param {string} hsl a string in the format of "hsl(hue saturation luminance)"
 */
export const hslToHex = (hsl) => {
  // since creating a(n appealing) unique color with HSL is much simpler than doing it with just hex (hue instead of #Rr, #Gg, and #Bb), we want to use the HSL method
  // however, Yjs awareness only supports hex colors, so we need to convert the HSL to hex
  // however * 2, as HSL and HEX are completely different color models, that's a bad way of going about it.
  // so instead we create an RGB interim color, then convert that RGB to hex
  const formattedHSL = hsl.split("(")[1].split(")")[0].split(" ");
  const rgb = hslToRgb(
    parseInt(formattedHSL[0]),
    parseInt(formattedHSL[1]),
    parseInt(formattedHSL[2]),
  );

  let hex = "#";

  for (const color of rgb) {
    const firstNum = Math.floor(color / 16);
    const secondNum = color % 16;
    const colHex = firstNum.toString(16) + secondNum.toString(16);
    hex += colHex;
  }

  return hex;
};

const FILENAME_ICON_MAP = Object.freeze({
  c: "c.svg",
  cpp: "cpp.svg",
  cs: "csharp.svg",
  css: "css.svg",
  db: "sql.svg",
  folder: "folder.svg",
  go: "go.svg",
  html: "html.svg",
  java: "java.svg",
  js: "js.svg",
  jsconfig: "jsconfig.svg",
  json: "json.svg",
  jsx: "jsx.svg",
  kt: "kotlin.svg",
  kts: "kotlin.svg",
  lua: "lua.svg",
  md: "markdown.svg",
  py: "python.svg",
  rb: "ruby.svg",
  rs: "rust.svg",
  svelte: "svelte.svg",
  sql: "mysql.svg",
  sqlite: "sqlite.svg",
  ts: "typescript.svg",
  tsconfig: "tsconfig.svg",
  tsx: "tsx.svg",
  xml: "xml.svg",
  yaml: "yaml.svg",
  yml: "yaml.svg",
});

export const getFiletypeIcon = (filename) => {
  if (!FILENAME_ICON_MAP[filename]) return "default_file.svg";
  return FILENAME_ICON_MAP[filename];
};
