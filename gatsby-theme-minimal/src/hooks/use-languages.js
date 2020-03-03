import { useStaticQuery, graphql } from "gatsby"

export default () => {
  const { internationalization } = useStaticQuery(
    graphql`
      query authorsQuery {
        internationalization: dataJson(
          fileRelativePath: { eq: "/content/data/internationalization.json" }
        ) {
          languages {
            code
            label
          }
        }
      }
    `
  )

  return internationalization.languages
}