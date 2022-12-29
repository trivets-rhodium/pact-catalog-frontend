import { ChangeEventHandler } from 'react';

type SearchState = {
  type: string;
  value: {
    extensions: string;
    solutions: string;
  };
};

type SearchBarProps = {
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  onSearchTypeChange: ChangeEventHandler<HTMLInputElement>;
  searchState: SearchState;
};

export default function SearchBar(props: SearchBarProps) {
  const { onSearchValueChange, onSearchTypeChange, searchState: search } = props;
  return (
    <div>
      <label htmlFor="searchBar">Search</label>
      <input name="searchBar" type="text" onChange={onSearchValueChange} />
      <fieldset>
        <legend>Type</legend>
        <label htmlFor="dataModelExtensions">Data Model Extensions</label>
        <input
          type="radio"
          name="type"
          value="dataModelExtensions"
          checked={search.type === 'dataModelExtensions'}
          onChange={onSearchTypeChange}
        />
        <label htmlFor="conformingSolutions">Conforming Solutions</label>
        <input
          type="radio"
          name="type"
          value="conformingSolutions"
          onChange={onSearchTypeChange}
        />
      </fieldset>
    </div>
  );
}
