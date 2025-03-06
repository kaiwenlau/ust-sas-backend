import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';
import defineTeacherSubject from './TeacherSubjectModel';
import defineClass from './ClassModel';

const LOG = new Logger('TeacherClassModel.ts');

interface TeacherClassModel extends Model {
  id: number;
  teacherSubjectId: number;
  classId: number;
}

const defineTeacherClass = sequelize.define<TeacherClassModel>('TeacherClass', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  teacherSubjectId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TeacherSubjects',
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

defineTeacherSubject.belongsToMany(defineClass, {
  through: defineTeacherClass,
  foreignKey: 'teacherSubjectId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
defineClass.belongsToMany(defineTeacherSubject, {
  through: defineTeacherClass,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default defineTeacherClass;
