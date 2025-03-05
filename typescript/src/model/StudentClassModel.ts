import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';
import defineStudent from './StudentModel';
import defineClass from './ClassModel';

const LOG = new Logger('StudentClassModel.ts');

interface StudentClassModel extends Model {
  id: number;
  studentId: number;
  classId: number;
}

const defineStudentClass = sequelize.define<StudentClassModel>('StudentClass', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

defineStudent.belongsToMany(defineClass, { through: 'StudentClass' });
defineClass.belongsToMany(defineStudent, { through: 'StudentClass' });

export default defineStudentClass;
