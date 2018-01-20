# Description
It's a starter template for a web-developer.  I'll try to do all the best for improve it :3

# Installation
Don't forget to change **username** and **your_repo** to your own.

    git clone https://github.com/PowerSlime/starter_template.git
    cd starter_template
    git remote set-url origin https://github.com/username/your_repo.git
    npm install
    git push origin master
Now we'll create **gh-pages** branch and will push files from **dist** folder to the branch

    mkdir dist
    cd dist
    git init
    git remote add origin https://github.com/username/your_repo.git
    git checkout -b gh-pages
    echo "Hey!" >> index.html
    git add .
    git commit -m "Initial commit"
    git push origin gh-pages
# Using
After editing sources you should do commits when you are in "root" folder and in **master** branch.

	git checkout master
	git add .
	git commit -m "Some changes in src folder"
	git push origin master
When your **dist** have updates you can "upload" it by doing commits in **gh-pages** branch

	cd dist
	git checkout gh-pages
	git add .
	git commit -m "Some changes in dist folder"
	git push origin gh-pages
That's it.

# Running project
Just type **gulp** in root folder. It will starts BrowserSync and other gulp plugins.

	gulp
