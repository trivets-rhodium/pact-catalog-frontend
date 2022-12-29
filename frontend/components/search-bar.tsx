import { ChangeEventHandler } from 'react';

type SearchBarProps = {
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  onSearchTypeChange: ChangeEventHandler<HTMLSelectElement>;
  publishers: string[];
  onPublisherChange: ChangeEventHandler<HTMLSelectElement>;
};

export default function SearchBar(props: SearchBarProps) {
  const {
    onSearchValueChange,
    onSearchTypeChange,
    publishers,
    onPublisherChange,
  } = props;
  return (
    <div>
      <select defaultValue="" name="searchType" onChange={onSearchTypeChange}>
        <option disabled value="">
          Type
        </option>
        <option value="dataModelExtensions">Data Model Extensions</option>
        <option value="conformingSolutions">Conforming Solutions</option>
      </select>

      <input
        name="searchBar"
        type="text"
        onChange={onSearchValueChange}
        placeholder="Title"
      />

      <select
        defaultValue="allPublishers"
        name="publisher"
        onChange={onPublisherChange}
      >
        <option value="allPublishers">All publishers</option>
        {publishers.map((publisher) => {
          return (
            <option key={publisher} value={publisher}>
              {publisher}
            </option>
          );
        })}
      </select>
    </div>
  );
}
