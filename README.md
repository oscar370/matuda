# Matuda

Control panel for [Matugen](https://github.com/InioX/matugen) with service and daemon that detects wallpaper changes and recreates templates.

## Features

- Installs the Matugen binary, so Cargo is not required.
- Configure Matugen templates directly from the interface.
- Automatic template execution on wallpaper changes. This is handled by a background service, so the application does not need to remain open.

## Requirements

- Systemd.
- GNOME (currently the only supported DE).

## Usage

- Download the binary corresponding to your package manager [here](https://github.com/oscar370/Matuda/releases).
- Install and run.

## Development notes

Run the scripts in the `scripts` directory before starting front-end development; in development mode, the application will look for local files instead of downloading them from the repositories.
