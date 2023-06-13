const User = require("./User");
const Routine = require("./Routine");
const Exercise = require("./Exercise");
const SuperSet = require("./SuperSet");

// Establecer relación uno a muchos entre Usuario y Rutinas
User.hasMany(Routine);
Routine.belongsTo(User);

// Establecer relación uno a muchos entre Rutinas y Ejercicios
Routine.hasMany(Exercise);
Exercise.belongsTo(Routine);

// Establecer relación uno a muchos entre Usuario y Ejercicios
User.hasMany(Exercise);
Exercise.belongsTo(User);

// Establecer relación uno a muchos entre Rutinas y SuperSeries
Routine.hasMany(SuperSet);
SuperSet.belongsTo(Routine);

// Establecer relación uno a muchos entre SuperSeries y Ejercicios
SuperSet.hasMany(Exercise);
Exercise.belongsTo(SuperSet);

User.hasMany(SuperSet);
SuperSet.belongsTo(User);

module.exports = { User, Routine, Exercise, SuperSet };
