import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { useLocalJsonForm } from "gatsby-tinacms-json"
import Layout from '../components/layout';

export default () => {
  const data = useStaticQuery(graphql`
    query PageQuery {
      page: dataJson(pk: { eq: "page" }) {
        title
        ###############
        # Tina Fields #
        ###############
        fileRelativePath
        rawJson
      }
    }
  `)

  const [{ title }] = useLocalJsonForm(data.page, {
    label: "Page",
    fields: [
      { name: 'rawJson.title' , label: "Title", component: "text" },
    ]
  })

  return (
    <Layout>Homepage {title} in a user's site</Layout>
  )
}