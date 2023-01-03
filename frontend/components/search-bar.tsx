import { ChangeEventHandler } from 'react';

type SearchBarProps = {
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  publishers: string[];
  onPublisherChange: ChangeEventHandler<HTMLSelectElement>;
  status: string[];
  onStatusChange: ChangeEventHandler<HTMLSelectElement>;
};

export default function SearchBar(props: SearchBarProps) {
  const {
    onSearchValueChange,
    publishers,
    onPublisherChange,
    status,
    onStatusChange,
  } = props;
  return (
    <div>
      <h2 className="px-4">Search</h2>
      <div className="flex justify-between mb-14 px-4">
        {/* <select defaultValue="" name="searchType" className="flex-grow m-1 p-4">
          <option disabled value="">
            Type
          </option>
          <option value="dataModelExtensions">Data Model Extensions</option>
          <option value="conformingSolutions">Conforming Solutions</option>
        </select> */}

        <input
          name="searchBar"
          type="text"
          onChange={onSearchValueChange}
          placeholder="Search extensions"
          className="flex-grow m-1 p-4 rounded-sm"
        />

        <select
          defaultValue=""
          name="publisher"
          className="flex-grow m-1 p-4 rounded-sm"
          onChange={onPublisherChange}
        >
          <option value="">all publishers</option>
          {publishers.map((publisher) => {
            return (
              <option key={publisher} value={publisher}>
                {publisher}
              </option>
            );
          })}
        </select>

        <select
          defaultValue=""
          name="status"
          className="flex-grow m-1 p-4 rounded-sm"
          onChange={onStatusChange}
        >
          <option value="">all statuses</option>
          {status.map((status) => {
            return (
              <option key={status} value={status}>
                {status}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
