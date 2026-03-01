import { AuthRepo } from "./Auth/AuthRepo"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"
import { WorkoutRepo } from "./Workout/WorkoutRepo"
import { WorkoutRepoProvider } from "./Workout/WorkoutRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<WorkoutRepoProvider value={WorkoutRepo}>
			<AuthRepoProvider value={AuthRepo}>{children}</AuthRepoProvider>
		</WorkoutRepoProvider>
	)
}
