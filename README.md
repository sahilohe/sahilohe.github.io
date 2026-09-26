# Sahil Ohe: Personal Site

A minimalist, academic personal website built with plain HTML, CSS and JavaScript,
in the style of a clean researcher's homepage (centred header, social links, pill
navigation, dark/light theme). No build step, no dependencies; it deploys straight
to GitHub Pages.

## Structure

```
sahil-webiste/
├── index.html          # About (bio, focus)
├── projects.html       # Projects & Work (experience, projects, skills, certifications)
├── research.html       # Research & Notes (collapsible entries)
├── library.html        # Bookshelf (grid/list)
├── css/style.css       # site styling
├── css/library.css     # library-specific styling
├── js/data.js          # ALL editable content (projects, notes, skills, etc.)
├── js/main.js          # renders content into the pages
├── js/library.js       # renders the library from data/books.json
├── js/theme.js         # dark/light theme toggle
├── data/books.json     # book catalogue (233 entries)
├── covers/             # book cover images
├── assets/             # profile photo, CV, favicon
├── .nojekyll           # tells GitHub Pages to serve files as-is
└── README.md
```

The header and footer are static in each page; all list content is generated from
`js/data.js`.

## Editing content

Open `js/data.js` and edit the arrays:

- `focus`: short list of current interests.
- `experience`: roles with `role`, `org`, `location`, `period`, and a `points` array.
- `certifications`: list of programmes and certificates.
- `projects`: project entries with `title`, `category`, `status`, optional `year`,
  `summary`, and `link` (leave `link` empty for projects without a URL).
- `skills`: categories with an `items` array.
- `notes`: Research & Notes entries with `title` and `summary`.

Page prose (intros and the bio on the About page) lives directly in the HTML files.

## Bookshelf

The Bookshelf page renders the merged library project. Its data lives in
`data/books.json` and its cover images in `covers/`. Each entry resembles:

```json
{
  "title": "1984",
  "cat": "Fiction",
  "authors": ["george orwell"],
  "cover": "covers/1984-....jpg",
  "acc": "hsl(3 62% 72%)",
  "acc2": "hsl(3 70% 38%)",
  "copies": 1
}
```

`cover` paths are relative to the page, so keep them pointing at `covers/`. If a book
has no `cover`, the `acc`/`acc2` colors are used for a generated placeholder. The
shelf order is set by `CATEGORY_ORDER` in `js/library.js`, and the pinned favourites
shelf is set by the `FEATURED` list there.

## Local preview

From the `sahil-webiste` folder:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. (Opening the HTML files directly in a browser also
works, since there is no server-side logic.)

## Deploying to GitHub Pages

A workflow is included at `.github/workflows/deploy.yml`. It publishes the
`sahil-webiste` folder whenever `main` changes there.

1. Push this repo to GitHub.
2. Go to **Settings > Pages** and set **Source** to **GitHub Actions**.
3. Push a change under `sahil-webiste/`, or run the workflow manually from the **Actions** tab.

The site will be available at `https://<username>.github.io/<repo>/`.

### Custom domain

Add a file named `CNAME` inside `sahil-webiste/` containing your domain (e.g. `sahilohe.com`),
then configure the DNS records in your domain registrar and set the custom domain
under **Settings > Pages**.

## Notes

- All links and asset paths are relative, so the site works at any subpath.
- Ubuntu typeface, loaded from Google Fonts; no analytics or trackers.
- Theme preference is stored in `localStorage`, defaulting to dark.
