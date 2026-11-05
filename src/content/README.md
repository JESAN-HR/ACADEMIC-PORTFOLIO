# HOW TO UPDATE MY PORTFOLIO

Your content is now organized into separate files. Each file reads like a form: replace the text between quotes. You do not need to edit HTML or rendering code.

## Choose the right file

| What you want to change | File inside this folder |
| --- | --- |
| Name, photo, introduction, biography | `profile.js` |
| Add a degree or school | `education.js` |
| Add an award or scholarship | `achievements.js` |
| Add a project | `projects.js` |
| Add a research paper | `publications.js` |
| Add an ongoing thesis or study | `researchProjects.js` |
| Research topics | `researchInterests.js` |
| Skill groups | `skills.js` |
| Programming contest results | `competitions.js` |
| Email and professional profile links | `socialLinks.js` |

`index.js` combines these files automatically. Leave it alone. `sourceNotes.js` records source information and is not displayed. The former `portfolio.json` has been replaced by these files. The main repository README remains your personal profile.

## Add an education entry: copy, fill, save

1. Open `education.js`.
2. Find the commented example at the bottom of the file.
3. Copy only its `{ ... }` object into the main list, just before `];`.
4. Put a comma after the preceding object.
5. Replace the example values, choose a unique `id`, and change `visible` to `true`.

Example structure (illustrative only; not a real degree):

```js
export default [
  // Keep your existing education entries here, separated by commas.
  {
    id: "new-education",                  // Unique name, no spaces
    title: "Degree or qualification",     // What you studied
    organization: "University or school", // Institution
    dates: "Start – Expected completion", // Displayed exactly as written
    description: "Status and location",   // Only accurate, public details
    displayOrder: 4,                      // Smaller number = nearer the top
    visible: false,                       // Change to true when ready
  },
];
```

Do not replace your existing list with the example unless you intend to remove the old entries. Add the object inside the existing list instead. Only add degrees you have actually started; keep expected completion dates clear.

## Add an achievement

Open `achievements.js`. Copy the example at the bottom into its list and fill these fields:

```js
{
  id: "my-new-award",
  title: "Award title",
  organization: "Awarding organization",
  year: 2027,
  category: "Research / Competition / Scholarship",
  description: "What I achieved",
  proofUrl: "",       // Optional certificate link; blank hides the link
  displayOrder: 4,
  visible: false,     // Set true after filling the actual details
}
```

The same process works for projects, papers, skills, and competitions. Every collection file contains its own copy-and-fill template. Commented examples never appear on the website.

## Preview your changes

Open a terminal in the project folder, then run:

```sh
npm run build
```

Refresh `index.html` in your browser. This command validates your content and updates the root page and `dist/` deployment folder. If there is an error, correct the named file and field, then run the command again. Never edit `index.html` directly because it is generated.

Optional checks and HTTP preview:

```sh
npm test
npm start
```

The preview address is `http://127.0.0.1:4173`. Rebuild after editing and refresh the browser. Node.js 20 or later is required; there are no dependencies to install. You can also double-click `build-portfolio.cmd` on Windows to rebuild without typing a command.

## Simple rules

- Text belongs in quotes. Numbers, `true`, and `false` do not.
- Separate objects with commas. JavaScript permits a trailing comma.
- `//` starts a comment; comments do not appear on the website.
- Give each item a unique `id` within its file.
- `visible: false` hides an entry. Omit or use `true` to show it.
- `displayOrder: 1` appears before `displayOrder: 2`. Equal orders use newest year first, otherwise file order.
- `featured: true` includes a project in the Featured projects filter.
- Leave optional links as `""` to hide them. Use full `https://` URLs.
- Add as many entries as needed. Empty collections are supported.
- Keep skill exposure separate from Currently Learning.

## Publications and ongoing research

Author names are separate objects, in the exact order credited by the paper. Set `isMe: true` for your name. Set `authorsVerified: true` only after filling the complete verified list. The UnderWaterYOLO entry retains its supplied acceptance status and contribution until official metadata is available. A DOI field takes the identifier, not the full URL.

Use `researchProjects.js` for unfinished research. Keep it separate from accepted or published papers. The provisional investigation remains hidden. Do not turn planned participation into an award.

## Photo, links, and colors

Your portrait is `assets/profile.jpg`; change `photo` in `profile.js` to another file inside `assets/` to replace it. `socialLinks.js` controls all professional buttons. `showInHero: false` places a link in Contact only. The Google Scholar homepage is an intentional temporary link that you can replace with your profile URL.

Change the tokens at the top of `style.css` to adjust colors and fonts. Ordinary content edits do not require changing this file.

## GitHub Pages

The included workflow builds on pushes to `main`. In repository Settings → Pages, select GitHub Actions. Push your updated content files and the workflow generates the website. For manual hosting, upload `dist/`. No online deployment occurs when you run the local build.

## Prepare for MSc / PhD applications

The layout already prioritizes research and publications:
About → Research Interests → Selected Publications → Current Research → Education → Projects → Awards → Activities → Skills → Contact.

Your current status is preserved while the future graduate profile is ready in `profile.js`. After actually completing the degree, edit these two fields:

```js
"careerStage": "graduate",
"graduationDate": "Your actual completion month and year",
```

This switches the hero role, biography, contact message, search description, and DIU degree status together. You can revise the prepared text inside `graduateProfile` at any time. A completed bachelor's degree is described as Computer Science Graduate; it does not imply enrollment in an MSc or PhD.

Add each real paper in `publications.js` with its actual authors and status. There is no four-paper limit, no placeholder publications, and no manually maintained publication count. Update your thesis status in `researchProjects.js` independently when that research changes; graduating alone does not establish publication or completion of research.

## Download CV button

Your CV belongs at **cv/JESAN.pdf** in the project root. Overwrite that file with your latest PDF and rebuild. The build checks that it is a PDF, includes it in `dist/cv/JESAN.pdf`, and enables Download CV beside View publications. It works with GitHub Pages repository paths. If the file is missing, a disabled button and availability note appear instead of a broken link. No duplicate CV link in `socialLinks.js` is needed. The `cvUrl` field in `profile.js` is the source for this button.
