import { ChangeEventHandler } from 'react';

type SearchBarProps = {
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
};

export default function SearchBar(props: SearchBarProps) {
  const { onSearchValueChange } = props;
  return (
    <div>
      <h2 className="px-4">Search the Catalog</h2>
      <div className="flex justify-between mb-14 px-4">
        <input
          name="searchBar"
          type="text"
          onChange={onSearchValueChange}
          placeholder="Search extensions and solutions"
          className="flex-grow m-1 p-4 rounded-sm"
        />
      </div>
    </div>
  );
}
