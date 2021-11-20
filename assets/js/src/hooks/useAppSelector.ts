import { TypedUseSelectorHook, useSelector } from 'react-redux';
import type { RootState } from './../stores/store';

// Exporting typed useSelector hook for use throughout the app instead of plain `useSelector`
// This avoid having to import the types for the root state and useSelector in every component
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default useAppSelector;
