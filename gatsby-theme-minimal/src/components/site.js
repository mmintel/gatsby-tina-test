import React from 'react';
import { withPlugin } from "tinacms"
import { RemarkCreatorPlugin } from "gatsby-tinacms-remark"
import { useStaticQuery, graphql } from "gatsby"
import slugify from "slugify"
import { useGlobalJsonForm } from "gatsby-tinacms-json"

const Site = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteQuery {
      site: dataJson(
        fileRelativePath: { eq: "/content/data/site.json" }
      ) {
        title
        description

        rawJson
        fileRelativePath
      }
      internationalization: dataJson(
        fileRelativePath: { eq: "/content/data/internationalization.json" }
      ) {
        languages {
          code
          label
        }

        rawJson
        fileRelativePath
      }
    }
  `)

  const [site] = useGlobalJsonForm(data.site, SiteForm)
  const [internationalization] = useGlobalJsonForm(data.internationalization, InternationalizationForm)

  return (
    <>
      {typeof children === 'function' ? children({ site, internationalization }) : children}
    </>
  )
}

const SiteForm = {
  label: "Site",
  fields: [
    {
      label: "Title",
      name: "rawJson.title",
      component: "text",
      parse(value) {
        return value || ""
      },
    },
    {
      label: "Description",
      name: "rawJson.description",
      component: "text",
      parse(value) {
        return value || ""
      },
    },
  ],
}

const InternationalizationForm = {
  label: "Internationalization",
  fields: [
    {
      label: "Languages",
      name: "rawJson.languages",
      component: "group-list",
      itemProps: item => ({
        key: item.code,
        label: item.label,
      }),
      fields: [
        {
          label: "Code",
          name: "code",
          component: "text",
          parse(value) {
            return value || ""
          },
        },
        {
          label: "Label",
          name: "label",
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

export default withPlugin(Site, CreateDocumentPlugin)