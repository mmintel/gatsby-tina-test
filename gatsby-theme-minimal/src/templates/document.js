import React, { useMemo } from 'react';
import { graphql } from "gatsby"
import Layout from '../components/layout';
import {
  useLocalRemarkForm,
  DeleteAction,
} from "gatsby-tinacms-remark"

const Document = ({ data }) => {
  const DocumentForm = useMemo(() => {
    return {
      actions: [DeleteAction],
      fields: [
        {
          label: "Title",
          name: "rawFrontmatter.title",
          component: "text",
        },
        {
          name: "rawFrontmatter.draft",
          component: "toggle",
          label: "Draft",
        },
        {
          label: "Body",
          name: "rawMarkdownBody",
          component: "markdown",
        },
      ],
    }
  }, [])

  const [markdownRemark, form] = useLocalRemarkForm(
    data.markdownRemark,
    DocumentForm
  )

  return (
    <Layout>
      {markdownRemark.frontmatter.title}
    </Layout>
  )
};

export default Document;

export const documentQuery = graphql`
  query($slug: String!) {
    markdownRemark(
      frontmatter: { slug: { eq: $slug } }
    ) {
      id
      html

      frontmatter {
        slug
        date(formatString: "MMMM DD, YYYY")
        title
      }

      fileRelativePath
      rawFrontmatter
      rawMarkdownBody
    }
  }
`