# HOW TO UPDATE MY PORTFOLIO

All personal information is in `src/content/portfolio.json`. Edit it, save, and run `npm run build` in the project folder. Refresh the page. GitHub Actions rebuilds it automatically when you push changes.

## Editing basics

Use double quotes around text. Put commas between fields and objects, but not after the last item. Lists use `[]`, objects use `{}`. Use `true` and `false` without quotes. VS Code highlights JSON syntax mistakes; the build reports invalid fields. Do not edit generated `index.html`.

## Profile and links

Edit `profile` for your name, role, affiliation, location, email, and biography. Each `about` entry becomes a paragraph. Professional buttons live in `socialLinks`. An empty `url` hides the button. Only add verified LinkedIn, Scholar and CV links. Keep private information out of this file because your repository may be public.

Put your portrait in `assets/jesan.jpg`, then set `profile.photo` to `assets/jesan.jpg`. An empty photo field shows your initials. Your confirmed assets/profile.jpg is currently used and included in deployment.

## Add a project

Copy an existing object inside `projects`, or this example, replacing the text before setting `visible` to `true`:

```json
{
  "id": "my-next-project",
  "title": "My Project Name",
  "category": "Academic Project",
  "shortDescription": "A factual description of what I built.",
  "technologies": ["Python"],
  "repositoryUrl": "",
  "liveUrl": "",
  "playStoreUrl": "",
  "documentationUrl": "",
  "featured": false,
  "displayOrder": 5,
  "visible": false
}
```

`featured: true` includes it in the Featured projects filter. Empty links disappear. Repository labels do not imply complete open-source availability.

## Add a publication

Copy this example into `publications`. Verify the venue, status, ordered authors, and links before making it visible. These example authors are not actual publication metadata.

```json
{
  "id": "my-next-paper",
  "title": "Verified paper title",
  "authors": [
    { "name": "First Author", "isMe": false },
    { "name": "MD Habibur Rahman Jesan", "isMe": true }
  ],
  "authorsVerified": true,
  "contribution": "Co-author",
  "venue": "Verified venue name",
  "year": 2027,
  "type": "Conference",
  "status": "Accepted",
  "domain": "Computer Vision",
  "description": "A factual summary.",
  "abstract": "",
  "doi": "",
  "paperUrl": "",
  "pdfUrl": "",
  "codeUrl": "",
  "datasetUrl": "",
  "supplementaryUrl": "",
  "keywords": [],
  "displayOrder": 2,
  "visible": false
}
```

Put authors in their exact publication order; `isMe: true` highlights your name. Leave UnderWaterYOLO's `authorsVerified: false` until you have the complete list. Currently it displays your supplied contribution without claiming an incomplete list is the full citation. DOI takes an identifier, not a full URL. Filters populate from visible entries automatically. Acceptance does not establish final publication status.

## Research in progress

Copy a `researchProjects` entry for a new thesis or study. Edit title, dates, status, supervisor, description, questions and keywords. Keep unfinished research separate from publications. The provisional investigation is hidden until you decide to announce it.

## Add an award

Add an object to `achievements`, replacing example text:

```json
{
  "id": "my-next-award",
  "title": "Verified award name",
  "organization": "Organizer",
  "year": 2027,
  "description": "What the award recognizes.",
  "category": "Competition",
  "proofUrl": "",
  "displayOrder": 2,
  "visible": false
}
```

List actual awards, not planned participation. Set `visible` to `true` when ready.

## Education, interests and skills

Copy an existing object in `education`, `researchInterests`, or `skills`. Each needs a distinct `id`. Skill `items` and research-interest `topics` are lists of text. Keep developing skills under Currently Learning and degree statuses accurate.

## Hide, reorder and remove

`visible: false` hides an entry. Smaller `displayOrder` numbers appear first. Equal or absent order values sort by newest `year` when available, otherwise file order is retained. Remove the whole object to delete it, fixing surrounding commas. Empty lists show a readable empty state. There are no item limits.

## Colors and publishing

Edit the `:root` tokens at the top of `style.css`. Pastels are accents; darker sage links preserve readability. The supplied repo's layout and fonts are retained.

Run `npm test` and `npm run build`. Open `index.html`, or run `npm start` and visit the printed address. Check changed entries, links, filters and narrow-screen layout. Follow the main README to enable GitHub Pages deployment.

## Competitions and additional links

Edit `competitions` for participation and finalist results. Each entry has a `rounds` list containing `label`, `date`, `rank`, `solved`, and `standingsUrl`. Keep these separate from awards. Additional professional links and emails appear in Contact; `showInHero: false` keeps a link out of the compact header while retaining it in Contact. Project `highlights` and `fullDescription` appear under Project notes. `sourceNotes` records where imported information came from and is not rendered publicly.
