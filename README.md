# Description
[![GitHub license](https://img.shields.io/github/license/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/issues)
[![GitHub stars](https://img.shields.io/github/stars/PowerSlime/starter_template.svg)](https://github.com/PowerSlime/starter_template/stargazers)
[![Dependencies Status](https://david-dm.org/powerslime/starter_template/status.svg)](https://david-dm.org/powerslime/starter_template)
[![DevDependencies Status](https://david-dm.org/powerslime/starter_template/dev-status.svg)](https://david-dm.org/powerslime/starter_template?type=dev)

It's a starter template for a web-developer.  I'll try to do all the best for improve it :3

## Installation
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

### Running the project
Just type this command to start developing.
```Bash
npm run start
```

### Deployment
If your template is ready to deploy you have to run build command.
```Bash
npm run build
```

It will clean the dist folder and regenerate all the code.

# Thank you! 😉
