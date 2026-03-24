import { AuthRepo } from "./Auth"
import { AuthRepoProvider } from "./Auth/AuthRepoProvider"
import { WorkoutRepo } from "./Workout"
import { WorkoutRepoProvider } from "./Workout/WorkoutRepoProvider"

export const ReposProviders = ({ children }: { children: React.ReactNode }) => {
	return (
		<WorkoutRepoProvider value={WorkoutRepo}>
			<AuthRepoProvider value={AuthRepo}>{children}</AuthRepoProvider>
		</WorkoutRepoProvider>
	)
}
