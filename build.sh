#!/bin/sh

## compile schemas
cd src

## Remove compiled schemas
rm schemas/gschemas.compiled

## Recompile schemas
glib-compile-schemas schemas/

## Zip whole files
zip -r ../windowgestures@extension.amarullz.com.zip ./*

cd ..

## Install for user
EXT_DIR=~/.local/share/gnome-shell/extensions/windowgestures@extension.amarullz.com
echo "Installing to $EXT_DIR..."
mkdir -p "$EXT_DIR"
unzip -o windowgestures@extension.amarullz.com.zip -d "$EXT_DIR"

## Enable the extension
gnome-extensions enable windowgestures@extension.amarullz.com
echo "Installation complete! Please log out and log back in (or restart GNOME) to reload the shell."