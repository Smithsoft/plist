# MERN Client

To generate scss.d.ts files:

    cd client && npx tsm src --aliasPrefixes.~ node_modules/

Note that the files are bloated with type definitions for all of bootstrap as well so
delete these before using.

## Config

Note that for CRA, the var has to start with `REACT_APP_` so that CRA 
will propagate it up to the browser.

.env file var `REACT_APP_API` has URL for API server

## Fonts

* [Montserrat](https://fonts.google.com/specimen/Montserrat) - titles
* [Archivo](https://fonts.google.com/specimen/Archivo) - text

Both available from Google Fonts via the [Open Fonts License](https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL)