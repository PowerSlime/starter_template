# Description 👀
[![GitHub license](https://img.shields.io/github/license/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/issues)
[![GitHub stars](https://img.shields.io/github/stars/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/stargazers)
[![Dependencies Status](https://david-dm.org/powerslime/starter_template/status.svg)](https://david-dm.org/powerslime/starter_template)
[![DevDependencies Status](https://david-dm.org/powerslime/starter_template/dev-status.svg)](https://david-dm.org/powerslime/starter_template?type=dev)

It's a starter template for a web-developer.  I'll try to do all the best for improve it :3

## Installation 🛠
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
npm i
git push origin master
```

## Important
Please, use git hooks, included in `git-hooks` folder, and in case that you change the dist folder in `gulpfile.js`
make sure, that it changed in `git-hooks` files too.

To start using git hooks just drop files from `git-hooks` to `.git/hooks/` (in project folder).
**If you're using Linux** - don't forget to make them executable (`chmod +x .git/hooks/*`).

### What do that crap do? 👀
By default minimization is disabled to reduce CPU usage 🔥 in development mode, but when we're trying
to push our updates to git it will run `npm run build`, generate the commit message
and if all is OK - it will push the updates.

All files will be minified and dist folder will be cleaned up.

## Running the project 🚀
Just type this command to start developing.
```Bash
npm run start
```

### Deployment 📦
If your template is ready to deploy you have to run build command. It will minimize all the files and
clean up the dist folder.

```Bash
npm run build
```

**In case that you have setup git hooks - don't need to run this command. Just do the push.** 

# Thank you! 😉
