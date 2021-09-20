
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux'
import type {AppDispatch} from 'store'
import { RootState } from 'store/reducers'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector