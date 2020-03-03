import LanguageField from "./src/fields/language"

export const onClientEntry = () => {
  window.tinacms.fields.add({
    name: "language",
    Component: LanguageField,
  })
}
