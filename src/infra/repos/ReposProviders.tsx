import { AuthRepo } from "./Auth"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"
import { WorkoutRepo } from "./Workout"
import { WorkoutRepoProvider } from "./Workout/WorkoutRepoProvider"
import { ExerciseRepo } from "./Exercise/ExerciseRepo"
import { ExerciseRepoProvider } from "./Exercise/ExerciseRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<WorkoutRepoProvider value={WorkoutRepo}>
			<AuthRepoProvider value={AuthRepo}>
				<ExerciseRepoProvider value={ExerciseRepo}>
					{children}
				</ExerciseRepoProvider>
			</AuthRepoProvider>
		</WorkoutRepoProvider>
	)
}
