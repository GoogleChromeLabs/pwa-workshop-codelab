# PWA Edit

PWA Edit is the sample app that you'll build as you complete the [PWA Workshop](https://workshops.page.link/pwa-workshop).

## Files

There are two kinds of files in this codebase: application files and source files. Application files are files you will not touch during the course of the workshop; they exist to provide a full functional experience. Source files are files you'll be touching throughout the course of the workshop.

### Source files

- `js/main.js` - Main application JavaScript
- `service-worker.js` - Service worker file, first use during the Going Offline codelab
- `manifest.json` - Web App Manifest file, first used during the From Tab to Taskbar codelab
- `js/lib/install.js` - Provides a base class for the install button, used during the Install Button codelab
- `js/lib/actions.js` - Provides a base class for the menu, used during the Capable codelab

### Application files

- `index.html` - Main application HTML
- `offline.html` - Offline fallback HTML
- `preview/index.html` - Preview page HTML
- `css/*` - Styling for the applcation
- `images/*` - Images associated with the application
- `package.json` and `package-lock.json` - Node dependency files
- `wmr.config.mjs` - Config file for [WMR](https://www.npmjs.com/package/wmr), the light-weight build tool being used for this project.
