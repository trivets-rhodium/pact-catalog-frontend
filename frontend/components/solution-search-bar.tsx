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
    providers,
    onProviderChange,
    results,
    onResultChange,
  } = props;
  return (
    <div>
      <h2 className="px-4">Search Conforming Solutions</h2>
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
          name="provider"
          className="flex-grow m-1 p-4 rounded-sm"
          onChange={onProviderChange}
        >
          <option value="">all providers</option>
          {providers.map((provider) => {
            return (
              <option key={provider} value={provider}>
                {provider}
              </option>
            );
          })}
        </select>

        <select
          defaultValue=""
          name="result"
          className="flex-grow m-1 p-4 rounded-sm"
          onChange={onResultChange}
        >
          <option value="">all results</option>
          {results.map((result) => {
            return (
              <option key={result} value={result}>
                {result}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
