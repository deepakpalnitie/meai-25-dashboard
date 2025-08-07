# Material UI - Next.js example

## How to use

Download the example [or clone the repo](https://github.com/mui/material-ui):

<!-- #default-branch-switch -->

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/material-next
cd material-next
```

Install it and run:

```bash
npm install
npm run dev
```

or:

<!-- #default-branch-switch -->

[![Edit on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/mui/material-ui/tree/master/examples/material-next)

[![Edit on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/mui/material-ui/tree/master/examples/material-next)

## The idea behind the example

The project uses [Next.js](https://github.com/vercel/next.js), which is a framework for server-rendered React apps.
It includes `@mui/material` and its peer dependencies, including [Emotion](https://emotion.sh/docs/introduction), the default style engine in Material UI v5.
If you prefer, you can [use styled-components instead](https://mui.com/material-ui/guides/interoperability/#styled-components).

## The Link component

The [example folder](https://github.com/mui/material-ui/tree/HEAD/examples/material-next-ts) provides an adapter for the use of [Next.js's Link component](https://nextjs.org/docs/api-reference/next/link) with MUI.
More information [in the documentation](https://mui.com/material-ui/guides/routing/#next-js).

## What's next?

<!-- #default-branch-switch -->

You now have a working example project.
You can head back to the documentation and continue by browsing the [templates](https://mui.com/material-ui/getting-started/templates/) section.

---

## Project Configuration and Workflow

This project uses a multi-tenant architecture to serve multiple CSR project dashboards from a single codebase. All project configurations are managed in a central file, `projects.json`, which is the single source of truth.

For complete architectural details, see the documentation at [`info/README.md`](./info/README.md).

### Developer Workflow

Follow these steps to add a new project or update an existing one.

**1. Update Configuration**

Modify the root `projects.json` file to add or update a project's configuration details (e.g., sheet IDs, KML file IDs).

**2. Sync Backend Config**

The Google Apps Script backend uses its own configuration object. Run the following command to update it from `projects.json`:

```bash
node update-apps-script-config.js
```

**3. Deploy Backend**

Push the updated configuration to your deployed Google Apps Script using `clasp`:

```bash
clasp push
```

**4. Run the Frontend**

Start the local development server with:

```bash
npm run dev
```

To view a specific project, you must use the `projectHostname` query parameter in the URL, like so:
*   `http://localhost:3000/project?projectHostname=csr-meai.distincthorizon.net`

### Validation Utilities

To debug issues with project data files, you can use the built-in validation scripts. These scripts download the KML and JSON files from Google Drive, save them locally, and report any access or parsing errors.

*   **KML Validator**: `node kml_validator/validate.js`
*   **JSON Validator**: `node json_validator/validate.js`
