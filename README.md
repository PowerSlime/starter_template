# Description
[![GitHub license](https://img.shields.io/github/license/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/issues)
[![GitHub stars](https://img.shields.io/github/stars/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/stargazers)
[![Dependencies Status](https://david-dm.org/powerslime/starter_template/status.svg)](https://david-dm.org/powerslime/starter_template)
[![DevDependencies Status](https://david-dm.org/powerslime/starter_template/dev-status.svg)](https://david-dm.org/powerslime/starter_template?type=dev)

It's a starter template for a web-developer.  I'll try to do all the best for improve it :3

## Installation
I recommend to use `Yarn` for installing dependecies, because installing of dependecies is a bit faster than with `npm` (For example, for me `npm install` took about 42 seconds, with `yarn` - about 21 seconds). You can install it globally with following command:
```Bash
npm i -g yarn
```

Don't forget to change **username** and **your_repo** to your own.
*You have to clean default .git folder to clean all commits from this repo.*
```Bash
git clone https://github.com/PowerSlime/starter_template.git
cd starter_template
rmdir /S /Q .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/your_repo.git
yarn install
git push origin master
```

If you don't have `yarn`, use `npm install` instead of `yarn install`

**NOT RECOMMENDED**
If you have some problems with `npm install` (or `yarn install`) try to install `gulp` globally `npm install -g gulp@next`, or `yarn global add gulp@next`

## Using
After editing sources you should do commits when you are in "root" folder and in **master** branch.
```Bash
git add .
git commit -m "Some changes in src folder"
git push origin master
```

That's it.

### Running the project
Just type **gulp** in project's folder. It will starts BrowserSync and other gulp plugins.
```Bash
npm run start
```
if you don't have gulp, installed globally.

### Deployment
If your template is ready to deploy you have to run build command.
```Bash
npm run build
```

It will clean the dist folder and regenerate all the code.

# Thank you! 😉
