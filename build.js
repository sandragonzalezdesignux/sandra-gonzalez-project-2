import StyleDictionary from 'style-dictionary';
import { expandTypesMap, register } from '@tokens-studio/sd-transforms';
import ThemesLoader from 'sd-themes-loader';
import { platform } from 'os';

register(StyleDictionary, {
  withSDBuiltins: false,
});

StyleDictionary.registerTransform({
  name: "assets/background",
  type: "value",
  filter: (token) => token.$type === "asset",
  transform: (token) => `url("/app/assets/${token.$value}")`,
})

const loader = ThemesLoader(StyleDictionary);

async function run() {
  const themes = await loader.load ("/tokens")

  const globalTheme = themes.getThemeByName ("global")
  const lightTheme = themes.getThemeByName ("light");
  const darkTheme = themes.getThemeByName ("dark");

  const globalConfig = {
    log: {
      verbosity: "verbose"
    },

    expand: {
      typesMap: true
    },

    platforms: {
      web: {
        files: [
          {
            format: "css/variables",
            destination: "app/build/global/variables.css",
          }
        ],
        transforms: [
          "name/kebab",
          "ts/resolveMath",
          "size/pxToRem",
          "ts/typography/fontWeight",
          "ts/size/lineheight"
        ]
      }
    }

  }

  const lightConfig = {
    platforms: {
      web: {
        files: [
          {
            format: "css/variables",
            destination: "app/build/light/variables.css",
            options: {
              selector: ".light"
            }
          }
        ],
        transforms: [
          "name/kebab",
          "assets/background",

        ]
      }
    }
  }

  const darkConfig = {
    platforms: {
      web: {
        files: [
          {
            format: "css/variables",
            destination: "app/build/dark/variables.css",
            options: {
              selector: ".dark"
            }
          }
        ],
        transforms: [
          "name/kebab",
        ]
      }
    }
  }

  const androidConfig = {
    expand: {
      typesMap: true
    },

    platforms: {
      web: {
        files: [
          {
            format: "android/dimens",
            destination: "app/build/android/dimens.xml",
          }
        ],
        transforms: [
          "name/camel",
          "ts/resolveMath",
          "size/pxToRem",
          "ts/typography/fontWeight",
          "ts/size/lineheight"
        ]
      }
    }

  }

  globalTheme.addConfig(globalConfig).build()
  globalTheme.addConfig(androidConfig).build()
  lightTheme.addConfig(lightConfig).build()
  darkTheme.addConfig(darkConfig).build()


  //globalTheme.print ()
  //themes.print ()

}

run ();