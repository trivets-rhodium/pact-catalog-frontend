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
      <h2 className="px-4">Search</h2>
      <div className="flex justify-between mb-14 px-4">
        <select
          defaultValue=""
          name="searchType"
          onChange={onSearchTypeChange}
          className="flex-grow m-1 p-4"
        >
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
          className="flex-grow m-1"
        />

        <select
          defaultValue="allPublishers"
          name="publisher"
          onChange={onPublisherChange}
          className="flex-grow m-1"
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
    </div>
  );
}
