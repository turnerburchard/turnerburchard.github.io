# turnerburchard.github.io

This is simply a personal portfolio website.

Made 100% from scratch by Turner Burchard

The site uses Jekyll layouts and includes. Modern and retro pages share the
main layout. Article pages use the separate reading layout.

To preview with Jekyll installed, run `jekyll serve` and open
`http://localhost:4000`.

Gallery images live in `files/photos`, `files/wildlife`, `files/me`, and
`files/art`. After adding or removing images, run `node update-gallery.js`
to refresh `_data/gallery.json`. Jekyll embeds that data in the gallery page,
and `js/gallery.js` handles shuffling and the image modal.

Retro markup lives in `_includes/retro/`, with styles in `css/retro.css`
and interactions in `js/retro.js`. Article styles live in `css/reading.css`.
