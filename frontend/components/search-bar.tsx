import { ChangeEventHandler } from 'react';
import style from 'styles/SearchBar.module.css';

type SearchBarProps<T> = {
  title: string;
  placeholder?: string;
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  firstFilterName?: string;
  firstFilterContent?: string[];
  onFirstFilterChange?: ChangeEventHandler<HTMLSelectElement>;
  secondFilterName?: string;
  secondFilterContent?: string[];
  onSecondFilterChange?: ChangeEventHandler<HTMLSelectElement>;
};

export default function SearchBar<T>(props: SearchBarProps<T>) {
  const {
    title,
    placeholder,
    onSearchValueChange,
    firstFilterName,
    firstFilterContent,
    onFirstFilterChange,
    secondFilterName,
    secondFilterContent,
    onSecondFilterChange,
  } = props;
  return (
    <>
      <div>
        <h2 className="px-4">{title}</h2>
        <div className={`flex justify-evenly mb-14 px-4 ${style.search}`}>
          <input
            name="searchBar"
            type="text"
            onChange={onSearchValueChange}
            placeholder={placeholder}
            className="flex-grow m-1 p-4 rounded-sm"
          />

          {firstFilterName && firstFilterContent && onFirstFilterChange && (
            <div className={style['select-wrapper']}>
              <select
                defaultValue=""
                name={firstFilterName}
                className="flex-grow m-1 p-4 rounded-sm filter"
                onChange={onFirstFilterChange}
              >
                <option value="">all {firstFilterName}</option>
                {firstFilterContent.map((e) => {
                  return (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {secondFilterName && secondFilterContent && onSecondFilterChange && (
            <div className={style['select-wrapper']}>
              <select
                defaultValue=""
                name={secondFilterName}
                className="flex-grow m-1 py-4 pl-4 pr-6 rounded-sm"
                onChange={onSecondFilterChange}
              >
                <option value="">all {secondFilterName}</option>
                {secondFilterContent.map((e) => {
                  return (
                    <option key={e} value={e}>
                      {e}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
