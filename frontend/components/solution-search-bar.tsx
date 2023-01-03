import { ChangeEventHandler } from 'react';

type SolutionSearchProps = {
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  providers: string[];
  onProviderChange: ChangeEventHandler<HTMLSelectElement>;
  results: string[];
  onResultChange: ChangeEventHandler<HTMLSelectElement>;
};

export default function SolutionSearchBar(props: SolutionSearchProps) {
  const {
    onSearchValueChange,
    providers: publishers,
    onProviderChange: onPublisherChange,
    results: status,
    onResultChange: onStatusChange,
  } = props;
  return (
    <div>
      <h2 className="px-4">Search</h2>
      <div className="flex justify-between mb-14 px-4">
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
