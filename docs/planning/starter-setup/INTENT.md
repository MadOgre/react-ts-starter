## Goal
- To create a work environment which I can use to develop a full stack application later to be possibly deployed on AWS.

## Definition Of Done
- A project folder contains boilerplate code which can be committed to a GitHub repo which can be used to develop a React TypeScript application. Also, a Vagrant file exists so that I can launch a virtual machine on which this code is going to serve and run. Also, there is a documentation in the form of a README file which describes how anyone can download and easily run the project. Usually by typing vagrant up or something like this. Project should be easily served

## Constraints
- The project needs to use vite as its main development boilerplate. 
- The specific technologies I want to use are TypeScript, React, React Router, React Query. Those are the only libraries I want to pre install
- I want all files to use double quotes
- I want to have ESLint as part of the project. I want ESLint and TypeScript linting to serve as well as in the editor. I want an ESLint file to be prepared by using the most sensible defaults, which can be amended at a later time. Not too strict, but very sensible. I do want to enforce trailing commas and be structuring whenever possible
- Do not engineer anything that doesn't need to be engineered. I want the code to be as simple as possible. I want the sensible folder structure. If there's any file that is left as boilerplate for something else, I want that file removed. Everything needs to be either clearly documented or removed. There shouldn't be any hanging files left for later testing or anything like this
- I also want a separate file that's going to be called FILES.md That file should document every file in every folder except for hidden folders like node modules. It should explain the intent for every file being there

## Acceptance Criteria
[x] git hub repository exists in the folder with it's only branch called master
[x] a .gitignore file exists with sensible defaults for the technologies used
[x] Vite is installed with template for typescript and eslint
[x] react, react router, react query and pre-installed and working
[x] vagrant file exists and is able to be easily run by a user
[x] a script exists for easy local serving of the application
[x] a basic homepage exists and is served when the user serves the project
[x] scss works easily and without issue, there is a folder for styles where global style file lives (global.scss), also scss modules is installed and works
[x] FILES.md lists every non-hidden file and explains it's purpose
[x] eslint and typescript are checking during editing in VSCode as well as during serve
[x] hot module reload works seamlessly and fast
[x] the project boilerplate is polished and ready to accept code
[x] there is a sensible folder structure
[x] all code uses double quotes and that rule is part of eslint rules
[x] eslint uses a sensible ruleset (possibly derived from airbnb but not required)

## Thoughts
This is a brain dump. So basically, what I want is a complete boilerplate that is committed to GitHub that can be used to template other projects. I want this to be a React application with TypeScript. It has to have React query and React router. It has to have ESLint, it has to be ready to go. All the folders are where they need to be. The code needs to be clean. The user should have zero problems with it. Just grab and go. Download it straight from GitHub, run Vagrant up, run a serve. Or maybe there's even a script that just does it all. Run a serve, have local serve, and then proceed with making more tickets, more requests, and put on components. There's a folder where components go. There's a folder where pages go. There's a folder where future backend may potentially go if it even exists. Everything shipshape. There is a master branch. Master branch is ready to be, you know, you can just make more stuff, commit stuff, etc. That's kind of what I'm looking for. Completely solid React TypeScript base from which I can start to develop web applications. 