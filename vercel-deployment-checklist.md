# Vercel Deployment Checklist for Routine Tracker

Use this checklist to make sure your app is ready for Vercel deployment.

## Pre-Deployment

- [ ] Run `npm run build` locally to test the build process
- [ ] Check that all animations work in the production build
- [ ] Verify all features work correctly in both light and dark mode
- [ ] Make sure all dependencies are listed in package.json

## Vercel Setup

- [ ] Create a Vercel account if you don't have one
- [ ] Connect your GitHub/GitLab/Bitbucket account to Vercel
- [ ] Push your code to your repository
- [ ] Create a new project in Vercel dashboard

## Project Configuration

- [ ] Framework preset: Create React App
- [ ] Build command: `npm run build` or `yarn build`
- [ ] Output directory: `build`
- [ ] Install command: `npm install` or `yarn install`
- [ ] Development command: `npm start` or `yarn start`

## Post-Deployment

- [ ] Test live site functionality
- [ ] Test on mobile devices
- [ ] Check lighthouse performance score
- [ ] Set up custom domain (if applicable)

## Debugging Deployment Issues

If you encounter deployment issues:

1. Check the build logs in Vercel dashboard
2. Verify that the `vercel.json` configuration is correct
3. Make sure all files are being included in the build
4. Check for any environment variable requirements

## Vercel Optimization Opportunities

- [ ] Configure caching headers for static assets
- [ ] Add environment variables if needed
- [ ] Set up analytics
- [ ] Configure preview deployments for PRs
