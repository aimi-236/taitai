// _layout.tsx
import * as Font from "expo-font";
import { Slot } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext<any>(null);
export const useTheme = () => useContext(ThemeContext);

const Layout = () => {
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState({
    color: "white",
    palette: {
      background: "#fff",
      text: "#000",
      tagBg: "#eee",
      tagText: "#000",
    },
    font: "System",  //初期フォント
  });

  // assets/fonts内のカスタムフォントを読み込む
  useEffect(() => {
    (async () => {
      await Font.loadAsync({
        "HachiMaruPop-Regular": require("../assets/fonts/HachiMaruPop-Regular.ttf"),
        "KaiseiDecol-Regular": require("../assets/fonts/KaiseiDecol-Regular.ttf"),
        "MPLUSRounded1c-Regular": require("../assets/fonts/MPLUSRounded1c-Regular.ttf"),
        "ZenKurenaido-Regular": require("../assets/fonts/ZenKurenaido-Regular.ttf"),
        "NewTegomin-Regular": require("../assets/fonts/NewTegomin-Regular.ttf"),
        "ReggaeOne-Regular": require("../assets/fonts/ReggaeOne-Regular.ttf"),
        "Stick-Regular": require("../assets/fonts/Stick-Regular.ttf"),
      });
      setLoaded(true);
    })();
  }, []);

  if (!loaded) return null; // ロード中は一旦空表示

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Slot />
    </ThemeContext.Provider>
  );
};

export default Layout;
