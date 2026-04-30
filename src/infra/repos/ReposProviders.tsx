import { AuthRepo } from "./Auth"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"
import { WorkoutRepo } from "./Workout"
import { WorkoutRepoProvider } from "./Workout/WorkoutRepoProvider"
import { ExerciseRepo } from "./Exercise/ExerciseRepo"
import { ExerciseRepoProvider } from "./Exercise/ExerciseRepoProvider"
import { WorkoutExerciseRepo } from "./WorkoutExercise"
import { WorkoutExerciseRepoProvider } from "./WorkoutExercise/WorkoutExerciseRepoProvider"
import { WorkoutExerciseSetRepo } from "./WorkoutExerciseSet"
import { WorkoutExerciseSetRepoProvider } from "./WorkoutExerciseSet/WorkoutExerciseSetRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<WorkoutRepoProvider value={WorkoutRepo}>
			<AuthRepoProvider value={AuthRepo}>
				<ExerciseRepoProvider value={ExerciseRepo}>
					<WorkoutExerciseRepoProvider value={WorkoutExerciseRepo}>
						<WorkoutExerciseSetRepoProvider value={WorkoutExerciseSetRepo}>
							{children}
						</WorkoutExerciseSetRepoProvider>
					</WorkoutExerciseRepoProvider>
				</ExerciseRepoProvider>
			</AuthRepoProvider>
		</WorkoutRepoProvider>
	)
}
