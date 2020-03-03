import React from 'react';
import Relation from '../field-templates/relation';
import useLanguages from '../hooks/use-languages';

export default (props) => {
  const languages = useLanguages();
  return (
    <Relation
      title="Language"
      data={languages}
      itemKey="code"
      itemLabel="label"
      noDataText="You didn't create any languages."
      {...props}
    />
  )
}