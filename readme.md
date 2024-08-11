### MonthlyMap

- To get started with development
  - `cd app`
  - `npm run start`
  - View website
- To build:
  - `cd app`
  - `npm run build`
  - Compilied files should show up in the dist folder outside of app/
  - If running servers like Apache add relative pathing to script and link in head
    - Example: `<script type="module" crossorigin src="/assets/index-AQ0mtqtK.js"></script>`
    - Add the "."
    - `<script type="module" crossorigin src="./assets/index-AQ0mtqtK.js"></script>`

## Source Code

- inside app/src/
- Custom HTML components in CustomComponents
- css/ contains css files
- DateCustom.js - custom date element component
- SelectCustom.js - modified version of select component with button functionality
- Animation.js the animation logic of the Animation Component
- Download.js the download logic for downloading the map image
- InitilizeOptions.js - to set default values to all form options to prevent glitching on reload
- ProductLayers.js - the logic to display different product layers
- util.js - miscellaneous util functions
- Constants.js - contains all related constants for map functionality (i.e. variable names, date constraints, etc.)
- main.js - combines and starts all services and registers handlers for the map
