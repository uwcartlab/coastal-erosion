# coastal-erosion

Bugs
- [ ] (On build) TypeError: Failed exporting HTML for URL / (src/containers/Introduction): Cannot read property 'text' of null

To Do
- [ ] Implement vertical, article-esque layout
- [ ] Add hamburger menu
- [ ] Add a button to the bottom of each page that links to the next page for a sense of continuity between exhibits
- [ ] Fix issue where route changes force scroll position to top of page
- [ ] Get high resolution images
- [ ] Get rights for [Port Washington lighthouse photo](http://jamesmeyerphoto.com/strawberry-moon/dsc_7711/)


# Notes from 2020:

I've managed to get the same error mentioned above, but since I haven't used React or Babel
and only have minimal experience with Node.js it will take time to solve this issue and get the
content of the site that's been updated so far to build and run.

Also of note as it wasn't included in the original repo and I had to piece it together myself:
Built using static-react(and possibly also React, not sure if static-react extends React),
compiler work (I assume for JSX) Babel, and Node.js. I had to npm install all of these and then run via npm commands in the shell

# Notes from 2021:

The main focus was on rebuilding the calculator with Leaflet in a basic site set up. Previous files can be found in /old.
See main.js for calculator details. Data has shapefiles in bluff_lines_all_counties and ozaukee county as geojson for testing.
Converting shapefiles into geojson and loading them in as done in main.js should be sufficient for adding new counties.
