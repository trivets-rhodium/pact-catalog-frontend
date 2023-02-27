import { ChangeEventHandler, useEffect, useState } from 'react';
import style from 'styles/SearchBar.module.css';

type SearchBarProps<T> = {
  title: string;
  placeholder?: string;
  searchValue?: string;
  onSearchValueChange: ChangeEventHandler<HTMLInputElement>;
  firstFilterName?: string;
  firstFilterContent?: string[];
  firstFilterValue?: string;
  onFirstFilterChange?: ChangeEventHandler<HTMLSelectElement>;
  secondFilterName?: string;
  secondFilterContent?: string[];
  secondFilterValue?: string;
  onSecondFilterChange?: ChangeEventHandler<HTMLSelectElement>;
  thirdFilterName?: string;
  thirdFilterContent?: string[];
  thirdFilterValue?: string;
  onThirdFilterChange?: ChangeEventHandler<HTMLSelectElement>;
  color: 'green' | 'light-blue';
};

export default function SearchBar<T>(props: SearchBarProps<T>) {
  const {
    title,
    placeholder,
    searchValue,
    onSearchValueChange,
    firstFilterName,
    firstFilterContent,
    firstFilterValue,
    onFirstFilterChange,
    secondFilterName,
    secondFilterContent,
    secondFilterValue,
    onSecondFilterChange,
    thirdFilterName,
    thirdFilterContent,
    thirdFilterValue,
    onThirdFilterChange,
    color,
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
            value={searchValue}
            className="flex-grow m-1 p-4 rounded-sm"
          />

          {firstFilterName && firstFilterContent && onFirstFilterChange && (
            <div className={style[`select-wrapper-${color}`]}>
              <select
                name={firstFilterName}
                className="flex-grow m-1 py-4 pl-4 pr-6 rounded-sm filter"
                onChange={onFirstFilterChange}
                value={firstFilterValue}
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
            <div className={style[`select-wrapper-${color}`]}>
              <select
                name={secondFilterName}
                className="flex-grow m-1 py-4 pl-4 pr-6 rounded-sm"
                onChange={onSecondFilterChange}
                value={secondFilterValue}
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

          {thirdFilterName && thirdFilterContent && onThirdFilterChange && (
            <div className={style[`select-wrapper-${color}`]}>
              <select
                name={thirdFilterName}
                className="flex-grow m-1 py-4 pl-4 pr-6 rounded-sm"
                onChange={onThirdFilterChange}
                value={thirdFilterValue}
              >
                <option value="">all {thirdFilterName}</option>
                {thirdFilterContent.map((e) => {
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
