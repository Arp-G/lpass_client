import { useDispatch } from 'react-redux'
import type { AppDispatch } from './../stores/store';

// Exporting typed dispatch hook for use throughout the app instead of plain `useDispatch`
export default () => useDispatch<AppDispatch>();
