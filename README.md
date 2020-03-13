# Abstract Copy Extractor

Tools for extracting copy/content from an abstract project.

# How to Use

## 1: Get Node

Use nvm: https://github.com/nvm-sh/nvm#installing-and-updating

## 2: Install

Fork or Clone project:

`git clone git@github.com:ncheikh/abstract-copy-extractor.git`

`cd abstract-copy-extractor`

`nvm use` Will install node version

`npm install -g yarn`

`yarn install`

## 3: Setup

Get API Token from Abstract: https://developer.abstract.com/docs/authentication/

`cp .env_sample .env`

Update `.env` `API_TOKEN` field with your token

## 3: Using

Fetch Projects: `node scripts/fetch_projects.js `

Fetch Branches: `node scripts/fetch_branches.js <PROJECT_ID>`

Fetch SHAs: `node scripts/fetch_shas.js <PROJECT_ID> <BRANCH_ID>`

Fetch Copy: `node scripts/fetch_copy.js <PROJECT_ID> <BRANCH_ID> <SHA>`

Copy out put is in data folder


