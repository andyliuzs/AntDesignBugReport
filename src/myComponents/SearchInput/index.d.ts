import React from 'react';

export interface SearchInputProps {
  fetchFunction?:(value:any,callback:(responseArray:any[])=>void)=>void;
  oldData?:[],
  tableKey?:string
}

export default class SearchInput extends React.Component<SearchInputProps, any> {}
