# Tracker

A lightweight, customizable tracker for customers, dev tasks and testing — custom columns, inline editing, dark mode. Runs entirely in your browser, no setup needed.

## Features

- **Sections → categories → columns**: Customers, Development, Testing out of the box; add your own
- **Column types**: text, long text, dropdown, multi-select, people, links, date (calendar picker), number, checkbox, email, phone, progress, rating, created / last-edited time
- **Inline editing**, drag-to-reorder rows, sort, filter, search, column resize
- **Overview dashboard** with totals, status breakdowns, recent activity and a category browser
- **Personalised**: your name, light / dark / system theme, accent colour, guided tour
- **Backups**: export / import JSON, plus 14 daily snapshots kept in the browser

## Run it

It's a static site — just serve the `public/` folder:

```bash
python3 -m http.server 4600 -d public   # open http://localhost:4600
```

## Your data

Everything is stored in your browser (local storage) — nothing is sent anywhere.
Each browser / device has its own data, so use **⋯ → Export full backup** regularly
and **Import** it to move to another browser or computer.

## Tech

Vanilla HTML, CSS and JavaScript. No build step, no dependencies.
