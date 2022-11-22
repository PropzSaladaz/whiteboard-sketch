import colors from '/src/ui/colors.js';

class Theme {
  constructor(name, mainLineColor, eraserColor, backgroundColor, uiBackgroundColor) {
      this.name = name
      this.mainLineColor = mainLineColor
      this.eraserColor = eraserColor
      this.uiBackgroundColor = uiBackgroundColor
      this.backgroundColor = backgroundColor
  }
}

const themes = {
  light: new Theme("light", colors.black, colors.white, colors.white, colors.UIBackgroundLightTheme ),
  dark:  new Theme("dark" , colors.white, colors.black, colors.black, colors.white )
}

export default themes;