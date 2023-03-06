"use client";

import { createContext, useReducer } from "react";
import type { Dispatch } from "react";

interface MealContextValue {
  mealState: MealContextState;
  mealDispatch: Dispatch<MealAction>;
}

export const MealContext = createContext({} as MealContextValue);

type Meal = "BREAKEFAST" | "LUNCH" | "DINNER";

interface MealContextState {
  food?: string;
  servings?: number;
  meal?: Meal;
  category?: string;
}

type MealActionType = "SET_DATA" | "SET_CATEGORY";

interface MealAction {
  type: MealActionType;
  payload: MealContextState;
}

const MealReducer = (state: MealContextState, action: MealAction) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_DATA":
      return {
        ...state,
        food: payload.food,
        servings: payload.servings,
        meal: payload.meal,
      };
    case "SET_CATEGORY": {
      return {
        ...state,
        category: payload.category,
      };
    }
    default:
      return { ...state };
  }
};

const initalState: MealContextState = {
  food: undefined,
  servings: undefined,
  meal: undefined,
  category: "RECENT",
};

export const MealContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mealState, mealDispatch] = useReducer(MealReducer, initalState);

  return (
    <MealContext.Provider value={{ mealState, mealDispatch }}>
      {children}
    </MealContext.Provider>
  );
};
