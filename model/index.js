const User = require("./User");
const Routine = require("./Routine");
const Exercise = require("./Exercise");
const SuperSet = require("./SuperSet");
const Tag = require("./Tag");
const Log = require("./Log");

// Establecer relación muchos a muchos entre Rutinas y Ejercicios
Routine.belongsToMany(Exercise, { through: "RoutineExercise" });
Exercise.belongsToMany(Routine, { through: "RoutineExercise" });

// Establecer relación muchos a muchos entre SuperSeries y Ejercicios
SuperSet.belongsToMany(Exercise, { through: "SuperSetExercise" });
Exercise.belongsToMany(SuperSet, { through: "SuperSetExercise" });

// Establecer relación uno a muchos entre Rutinas y SuperSeries
Routine.belongsToMany(SuperSet, { through: "RoutineSuperSet" });
SuperSet.belongsToMany(Routine, { through: "RoutineSuperSet" });

// Establecer relación uno a muchos entre Rutinas y Etiquetas
Routine.belongsToMany(Tag, { through: "RoutineTag" });
Tag.belongsToMany(Routine, { through: "RoutineTag" });

// Establecer relación uno a muchos entre Usuario y Rutinas
User.belongsToMany(Routine, { through: "UserRoutine" });
Routine.belongsToMany(User, { through: "UserRoutine" });

// Establecer relación uno a muchos entre Usuario y Ejercicios
User.hasMany(Exercise);
Exercise.belongsTo(User);

// Establecer relación uno a muchos entre Usuario y SuperSeries
User.hasMany(SuperSet);
SuperSet.belongsTo(User);

User.hasMany(Log);
Log.belongsTo(User);
Log.belongsToMany(Routine, { through: "RoutineLogs" });
Routine.belongsToMany(Log, { through: "RoutineLogs" });

module.exports = { User, Routine, Exercise, SuperSet, Tag, Log };
