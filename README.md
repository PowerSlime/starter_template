

# Description
It's a starter template for a web-developer.  I'll try to do all the best for improve it :3

# Installation
I recommend to use `Yarn` for installing dependecies, because installing of dependecies is a bit faster than with `npm` (For example, for me `npm install` took about 42 seconds, with `yarn` - about 21 seconds). You can install it globally with following command:
```Bash
npm i yarn -g
```

Don't forget to change **username** and **your_repo** to your own.
```Bash
git clone https://github.com/PowerSlime/starter_template.git
cd starter_template
git remote set-url origin https://github.com/username/your_repo.git
yarn install
git push origin master
```

If you don't have `yarn`, use `npm install` instead of `yarn install`

If you have some problems with `npm install` (or `yarn install`) try to install `gulp` globally `npm install -g gulp`, or `yarn global add gulp`

Now we'll create **gh-pages** branch and will push files from **dist** folder to the branch
```Bash
mkdir dist
cd dist
git init
git remote add origin https://github.com/username/your_repo.git
git checkout -b gh-pages
echo "Hey!" >> index.html
git add .
git commit -m "Initial commit"
git push origin gh-pages
```
# Using
After editing sources you should do commits when you are in "root" folder and in **master** branch.
```Bash
git checkout master
git add .
git commit -m "Some changes in src folder"
git push origin master
```
When your **dist** have updates you can "upload" it by doing commits in **gh-pages** branch
```Bash
cd dist
git checkout gh-pages
git add .
git commit -m "Some changes in dist folder"
git push origin gh-pages
```
That's it.

# Running the project
Just type **gulp** in root folder. It will starts BrowserSync and other gulp plugins.
```Bash
gulp
```
or
```Bash
npm run gulp
```
if you don't have gulp, installed globally.
