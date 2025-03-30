# Hydravion-Smart-TV

# !! This project is a WIP !!

Rewrite of Hydravion, an unofficial Floatplane client, for LG webOS & Samsung Tizen TVs.

This project is NOT associated with Floatplane Media (floatplane.com).

Looking for Roku? https://github.com/bmlzootown/Hydravion

Looking for Android TV? https://github.com/bmlzootown/Hydravion-AndroidTV

Looking for Apple TV/tvOS? https://github.com/Jman012/Wasserflug-tvOS

## Screenshots

TODO: Add some screenshots

## Features

TODO: Detail what this app can & can't do

## Installation

TODO: Detail install instructions

## Development

#### IDE setup

It is highly recommended to install the Blits [VS-code extension](https://marketplace.visualstudio.com/items?itemName=LightningJS.lightning-blits) which will give you template highlighting and improved autocompletion.

TODO: Detail any required LG webOS SDK & Tizen IDE setup

#### Project setup

Run the following command to install the dependencies of your App:

```sh
npm install
```

#### Build and run in development mode

Run your App in development mode:

```sh
npm run dev
```

This command uses Vite to fire up a local server, with Hot Reloading support. Visit the provided link in your web browser to see the App in action.

#### Build the App for production

Create an optimized and minified version of your App:

```sh
npm run build
```

This will create a production version of the app in the `dist` folder.

#### Floatplane API

This project's API implementation is based upon the OpenAPI specification found in https://github.com/jamamp/FloatplaneAPI
You can open this with preferred tooling or use rest.wiki's viewer [here](https://rest.wiki/?https://raw.githubusercontent.com/jamamp/jman012.github.io/refs/heads/main/FloatplaneAPIDocs/floatplane-openapi-specification-trimmed.json)

#### LG webOS docs & examples

https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine
https://webostv.developer.lge.com/assets/web-api/Supported_Standard_Web_APIs_2019.pdf
https://webostv.developer.lge.com/develop/specifications/streaming-protocol-drm
https://webostv.developer.lge.com/develop/specifications/video-audio-230
https://webostv.developer.lge.com/develop/references/webos-event
https://webostv.developer.lge.com/develop/references/database
https://webostv.developer.lge.com/develop/references/media-database

https://github.com/webOS-TV-app-samples/BackButtonControl
https://github.com/webOS-TV-app-samples/MediaPlayback
https://github.com/webOS-TV-app-samples/AppLifecycle

#### Tizen docs & examples

TODO: Investigate supporting Tizen for Samsung TVs

https://docs.tizen.org/application/web/guides/app-management/message-port/
https://docs.tizen.org/application/web/guides/w3c/communication/comm-guide/
https://docs.tizen.org/application/web/guides/w3c/storage/storage-guide/

#### Blits guides / blogs

- [Blits Documentation](https://lightningjs.io/v3-docs/blits/getting_started/intro.html) - official documentation
- [Blits Example App](https://blits-demo.lightningjs.io/?source=true) - a great reference to learn by example
- [Blits Components](https://lightningjs.io/blits-components.html) - off-the-shelf, basic and performant reference components
- [Blits Basics Blog](https://mlangendijk.medium.com/lightning3-the-basics-of-blits-a8efae621802)
- [Blits Video Playblack Blog](https://mlangendijk.medium.com/video-playback-with-blits-lightning3-38a2e247d871)
- [Blits Deployment Blog](https://mlangendijk.medium.com/deploying-and-running-lightning-3-apps-with-blits-on-smarttv-75b175376d60)

## Related

See bmlzootown's Hydravion projects and Discord server and more for other Floatplane-related software and discussion:

- https://github.com/bmlzootown/Hydravion
- https://github.com/bmlzootown/Hydravion-AndroidTV
- https://github.com/Jman012/Wasserflug-tvOS
- https://discord.gg/4xKDGz5M5B
- https://jman012.github.io/FloatplaneAPIDocs/
