import {Dispatch} from "redux";
import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from "../../app/app-reducer";
import {authAPI, LoginParamsType} from "../../api/todolists-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodolistsAC} from "../TodolistsList/todolists-reducer";
import {AppThunk} from "../../app/store";

const initialState = {
    isLoggedIn: false
}

type initialStateType = typeof initialState;

export const authReducer = (state: initialStateType = initialState, action: AuthActionsType): initialStateType => {
    switch (action.type) {
        case "login/SET-IS-LOGGED-IN":
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}


export const setIsLoggedInAC = (value: boolean) => ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export type setIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>

export type AuthActionsType =
    | setIsLoggedInACType
    | SetAppErrorActionType
    | SetAppStatusActionType

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<AuthActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    authAPI.login(data)
        .then((res) => {
            if(res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC('succeeded'));
            } else {
                handleServerAppError(res.data, dispatch);
            }
        }).catch((err) => {
        handleServerNetworkError(err, dispatch);
    })
}

export const logoutTC = (): AppThunk => (dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
                dispatch(clearTodolistsAC())
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            handleServerNetworkError(error, dispatch)
        })
}


