const path = require(`path`)
const { GraphQLBoolean } = require("gatsby/graphql")

exports.setFieldsOnGraphQLNodeType = ({ type }) => {
  if ("MarkdownRemark" === type.name) {
    return {
      published: {
        type: GraphQLBoolean,
        resolve: ({ frontmatter }) => {
          if (process.env.NODE_ENV !== "production") {
            return true
          }
          return !frontmatter.draft
        },
      },
    }
  }
  return {}
}

exports.createPages = async ({ graphql, actions, reporter }, options) => {
  const { createPage } = actions

  const documentTemplate = path.resolve(__dirname, `./src/templates/document.js`)
  const result = await graphql(
    `
      query DocumentQuery {
        allFile(filter: {sourceInstanceName: {eq: "documents"}}) {
          edges {
            node {
              childMarkdownRemark {
                published
                frontmatter {
                  slug
                  language
                }
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    throw result.errors
  }

  const documents = result.data.allFile.edges

  documents.forEach((document, index) => {
    const node = document.node;
    const { published, frontmatter } = node.childMarkdownRemark;
    const { slug, language } = frontmatter;
    const isDefaultLanguage = options.defaultLanguage === language;
    let path = slug;

    if (!isDefaultLanguage) {
      path = `${language}/${slug}`
    }

    if (path !== '/') {
      path = path.replace(/([^:]\/)\/+/g, '$1'); // remove double slashes
    }

    if (!published) return

    const page = {
      path,
      component: documentTemplate,
      context: {
        slug,
        language,
      },
    }

    createPage(page)
  })
}
