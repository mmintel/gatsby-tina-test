const path = require('path')

const MONOREPO_PATH = path.resolve(process.cwd(), '..')

console.log({ MONOREPO_PATH})

module.exports = {
  plugins: [
    {
      resolve: `gatsby-theme-minimal`,
      options: {
        pathToRepo: MONOREPO_PATH,
        pathToContent: 'example'
      }
    }
  ],
}
