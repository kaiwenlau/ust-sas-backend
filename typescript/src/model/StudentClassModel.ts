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
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id',
    },
  },
  classId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'classes',
      key: 'id',
    },
  },
});

defineStudent.belongsToMany(defineClass, {
  through: defineStudentClass,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
defineClass.belongsToMany(defineStudent, {
  through: defineStudentClass,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default defineStudentClass;
