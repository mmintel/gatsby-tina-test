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

exports.createPages = async ({ graphql, actions, reporter }) => {
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
    const slug = node.childMarkdownRemark.frontmatter.slug;
    const published = node.childMarkdownRemark.published;

    if (!published) return

    const page = {
      path: slug,
      component: documentTemplate,
      context: {
        slug,
      },
    }

    createPage(page)
  })
}
