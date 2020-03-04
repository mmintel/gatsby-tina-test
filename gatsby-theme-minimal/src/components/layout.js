import React from 'react';
import { withPlugin } from "tinacms"
import { RemarkCreatorPlugin } from "gatsby-tinacms-remark"
import { useStaticQuery, graphql } from "gatsby"
import slugify from "slugify"
import { useGlobalJsonForm } from "gatsby-tinacms-json"

const Layout = ({children}) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      navigation: dataJson(
        fileRelativePath: { eq: "/content/data/navigation.json" }
      ) {
        main {
          label
          link
        }

        rawJson
        fileRelativePath
      }
    }
  `)

  const [navigation] = useGlobalJsonForm(data.navigation, NavigationForm)

  return (
    <div>
      {children}
    </div>
  )
}

const NavigationForm = {
  label: "Navigation",
  fields: [
    {
      label: "Main Menu",
      name: "rawJson.main",
      component: "group-list",
      itemProps: item => ({
        label: item.label,
      }),
      fields: [
        {
          label: "Label",
          name: "label",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Link",
          name: "link",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
      ],
    },
  ],
}


const CreateDocumentPlugin = new RemarkCreatorPlugin({
  /**
   * Clicking the `+` button reveals a lost of content
   * types that can be created. This field sets the
   * label in that list.
   */
  label: "Document",
  /**
   * Clicking the `Post` in the `+` list opens a modal.
   * This modal contains a form with these fields.
   */
  fields: [
    { name: "title", component: "text", label: "Title" },
    { name: "language", component: "language", label: "Language" },
  ],
  /**
   * Tina needs to know where the new markdown file is
   * going to live. This `filename` function generates
   * that path from the form's values. This function is required.
   */
  filename(form) {
    const slug = slugify(form.title.toLowerCase())
    return `content/documents/${form.language}/${slug}.md`
  },
  /**
   * We can optionally generate default frontmatter for the
   * new post. This can be a combination of form data and
   * programmatically generated.
   */
  frontmatter(form) {
    const slug = slugify(form.title.toLowerCase())
    return {
      title: form.title,
      date: new Date(),
      description: "",
      slug,
    }
  },
  /**
   * Finally, we can generate a default body. Right now
   * we don't need to do that.
   */
  body(form) {
    return ""
  },
})

export default withPlugin(Layout, CreateDocumentPlugin)