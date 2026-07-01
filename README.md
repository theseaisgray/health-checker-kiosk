# Health Self-Check Kiosk

A responsive, walk-in style web app that lets a user enter basic info (name, age, sex, weight, height), instantly computes their **BMI**, classifies it into a health category, shows a tailored recommendation, and records every submission to a **Google Sheet** for staff follow-up.

Built for: **De La Salle University – Dasmariñas, CICS, Laboratory 5**

## The Problem

Students and employees often have no quick, private way to check their BMI without visiting the clinic. This kiosk gives instant feedback and quietly logs usage so the school nurse / HR office can monitor and follow up with at-risk individuals.

## Features

- Semantic, responsive HTML/CSS layout (Flexbox + media queries) that adapts to desktop, tablet, and mobile.
- Client-side validated form (name, age, sex, weight, height, consent).
- `script.js` demonstrates all three required control structures:
  - **if-else** — validates each form field before processing.
  - **switch-case** — maps computed BMI to a category, message, and color.
  - **loop** (`for...of` / `forEach`) — validates every required field in one pass, and renders the session's submission history.
- Color-coded result card (blue = Underweight, green = Normal, orange = Overweight, red = Obese).
- Submissions POSTed as JSON to a Google Apps Script Web App, which appends a row to a connected Google Sheet.

## Project Structure

```
health-checker-kiosk/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Running Locally

1. Clone or download this repository.
2. Open `index.html` directly in a browser, or serve the folder with any static server (e.g. VS Code Live Server).

## Connecting the Google Sheet Backend

1. Create a Google Sheet named **BMI Kiosk Records** with header row: `Timestamp, Name, Age, Sex, Weight, Height, BMI, Category`.
2. In the Sheet, go to **Extensions > Apps Script** and paste a `doPost` function that reads the incoming JSON and appends it as a new row (see lab handout / project notes for the sample script).
3. **Deploy > New deployment > Web app**, set **Execute as: Me** and **Who has access: Anyone**, then **Deploy** and authorize.
4. Copy the generated Web App URL and paste it into the `APPS_SCRIPT_URL` constant at the top of `script.js`.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit: BMI kiosk web app"
git remote add origin <your-repo-url>
git push -u origin main
```

Then enable **GitHub Pages** in the repository's Settings to get a live demo link.

## Disclaimer

This tool is for general wellness screening only and is not a substitute for professional medical advice.
