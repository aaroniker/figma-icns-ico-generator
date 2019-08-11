# Figma .icns File Generator

Generate .icns ([Apple Icon Image format](https://en.wikipedia.org/wiki/Apple_Icon_Image_format)) files directly from Figma.

## Usage

...

## Development

First clone this repository
```shell
git clone https://github.com/aaroniker/figma-icns-file-generator.git
cd figma-icns-file-generator
```

Install dependencies & build files
```shell
npm install
npm run build
# Or watch: npm run dev
```

After that open a project in Figma Desktop, select _Plugins -> Development -> New Plugin_. Click `Choose a manifest.json` and find the `manifest.json` file in this plugin directory.

Done! Now _Plugins -> Development -> .icns File Generator_
