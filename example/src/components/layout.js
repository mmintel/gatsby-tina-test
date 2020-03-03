import React from 'react';
import { withPlugin } from "tinacms"
import { RemarkCreatorPlugin } from "gatsby-tinacms-remark"
import slugify from "slugify"

const Layout = ({children}) => {
  return (
    <div>{children}</div>
  )
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
  fields: [{ name: "title", component: "text", label: "Title" }],
  /**
   * Tina needs to know where the new markdown file is
   * going to live. This `filename` function generates
   * that path from the form's values. This function is required.
   */
  filename(form) {
    let slug = slugify(form.title.toLowerCase())

    return `content/documents/${slug}/index.md`
  },
  /**
   * We can optionally generate default frontmatter for the
   * new post. This can be a combination of form data and
   * programmatically generated.
   */
  frontmatter(form) {
    return {
      title: form.title,
      date: new Date(),
      description: "",
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