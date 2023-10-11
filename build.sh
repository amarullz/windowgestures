#!/bin/sh

## compile schemas
cd src

## Remove compiled schemas
rm schemas/gschemas.compiled

## Zip whole files
zip -r ../windowgestures@extension.amarullz.com.zip ./*

## Recompile schemas
glib-compile-schemas schemas/

cd ..