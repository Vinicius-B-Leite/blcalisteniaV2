import { Database } from "@nozbe/watermelondb"
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite"

import schema from "./schema"
import migrations from "./migrations"
import UsersModel from "./models/UsersModel"
import WorkoutsModel from "./models/WorkoutsModel"
import ExercisesModel from "./models/ExercisesModel"
import WorkoutExercisesModel from "./models/WorkoutExercisesModel"
import WorkoutExerciseSetsModel from "./models/WorkoutExerciseSetsModel"

const adapter = new SQLiteAdapter({
	schema,
	migrations,
	jsi: true,
	onSetUpError: (error) => {},
})

export const database = new Database({
	adapter,
	modelClasses: [
		UsersModel,
		WorkoutsModel,
		ExercisesModel,
		WorkoutExercisesModel,
		WorkoutExerciseSetsModel,
	],
})
