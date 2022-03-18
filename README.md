# theflailingbaker

> 100% Whole Wheat Sourdough Bread

This repository contains code for my bread baking website, [theflailingbaker.com](http://theflailingbaker.com). It is linked to my other sites, [exultoshores.com](http://exultoshores.com) and [alongthelonging.com](http://alongthelonging.com). 

## Contents

The site is hosted on an Amazon Lightsail instance running an Ubuntu distribution of Linux. The stack looks like this:

- Web server: Apache 2
- Application language: Python 3
    - Main libraries: Flask, SQLAlchemy
- Database: PostgreSQL 10
- Frontend: JavaScript, CSS and HTML (no frameworks)

## Features (Recipe and Tools)

- The content is stored in the database with separate tables for procedure, substeps, variables, metrics, and tools
- Content can be edited in the browser (authentication required)
