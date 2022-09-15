import colors from '/src/ui/colors.js';

class Theme {
  constructor(name, mainLineColor, eraserColor, uiBackgroundColor, backgroundColor) {
      this.name = name
      this.mainLineColor = mainLineColor
      this.eraserColor = eraserColor
      this.uiBackgroundColor = uiBackgroundColor
      this.backgroundColor = backgroundColor
  }
}

const themes = {
  light: new Theme("light", colors.black, colors.white, colors.black, colors.UIBackgroundLightTheme ),
  dark:  new Theme("dark" , colors.white, colors.black, colors.white, colors.black )
}

export default themes;