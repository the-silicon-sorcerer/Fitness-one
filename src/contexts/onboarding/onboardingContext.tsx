"use client";

import { createContext, useReducer, useEffect } from "react";
import { trpc } from "../../utils/trpcProvider";
import z from "zod";

import isMutation from "../../utils/isMutation";
import type {
  ProgressStateValue,
  ProgressAction,
  ProgressValue,
} from "../../types/progressContext";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Experience = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type FitnessGoal = "SIZE" | "STRENGTH";
export type NutritionGoal = "BULKING" | "CUTTING" | "MAINTAIN";

export interface OnboardingState extends ProgressStateValue {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  age?: number;
  weight?: number;
  height?: number;
  experience?: Experience;
  fitnessGoal?: FitnessGoal;
  nutritionGoal?: NutritionGoal;
  weightGoal?: number;
}

export const OnboardingSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  gender: z.union([z.literal("MALE"), z.literal("FEMALE"), z.literal("OTHER")]),
  age: z.number().min(1),
  weight: z.number().min(1),
  height: z.number().min(1),
  experience: z.union([
    z.literal("BEGINNER"),
    z.literal("INTERMEDIATE"),
    z.literal("ADVANCED"),
  ]),
  fitnessGoal: z.union([z.literal("SIZE"), z.literal("STRENGTH")]),
  nutritionGoal: z.union([
    z.literal("BULKING"),
    z.literal("CUTTING"),
    z.literal("MAINTAIN"),
  ]),
  weightGoal: z.number().min(1),
  currentPage: z.number().min(1),
});

export const OnboaringContext = createContext(
  {} as ProgressValue<OnboardingState>
);

const onboardingReducer = (
  state: OnboardingState,
  action: ProgressAction<OnboardingState>
) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_DATA":
      if (typeof payload !== "number" && !isMutation(payload)) {
        return {
          ...state,
          firstName: payload.firstName,
          lastName: payload.lastName,
          gender: payload.gender,
          age: payload.age,
          weight: payload.weight,
          height: payload.height,
          experience: payload.experience,
          fitnessGoal: payload.fitnessGoal,
          nutritionGoal: payload.nutritionGoal,
          weightGoal: payload.weightGoal,
        };
      }
      return { ...state };
    case "SET_MUTATION":
      if (typeof payload !== "number" && isMutation(payload)) {
        return { ...state, mutation: payload };
      }
      return { ...state };
    case "PAGE_CHANGE":
      if (typeof payload === "number") {
        return { ...state, currentPage: payload };
      }
      return { ...state };
    default:
      return state;
  }
};

const initalState: OnboardingState = {
  firstName: undefined,
  lastName: undefined,
  gender: undefined,
  age: undefined,
  weight: undefined,
  height: undefined,
  experience: undefined,
  fitnessGoal: undefined,
  nutritionGoal: undefined,
  weightGoal: undefined,
  currentPage: 1,
  mutation: undefined,
  stateSchema: OnboardingSchema,
};

export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [progressData, progressDispatch] = useReducer(
    onboardingReducer,
    initalState
  );
  const mutation = trpc.setup.onboarding.useMutation();

  useEffect(() => {
    progressDispatch({ type: "SET_MUTATION", payload: mutation });
  }, []);

  return (
    <OnboaringContext.Provider value={{ progressData, progressDispatch }}>
      {children}
    </OnboaringContext.Provider>
  );
};
