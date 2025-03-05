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
});

defineTeacherSubject.belongsToMany(defineClass, { through: 'TeacherClass' });
defineClass.belongsToMany(defineTeacherSubject, { through: 'TeacherClass' });

export default defineTeacherClass;
