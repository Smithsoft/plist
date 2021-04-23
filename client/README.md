# MERN Client

To generate scss.d.ts files:

    cd client && npx tsm src --aliasPrefixes.~ node_modules/

Note that the files are bloated with type definitions for all of bootstrap as well so
delete these before using.