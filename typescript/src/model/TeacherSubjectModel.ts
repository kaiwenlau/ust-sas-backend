import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';
import defineTeacher from './TeacherModel';
import defineSubject from './SubjectModel';

const LOG = new Logger('TeacherSubjectModel.ts');

interface TeacherSubjectModel extends Model {
  id: number;
  teacherId: number;
  subjectId: number;
}

const defineTeacherSubject = sequelize.define<TeacherSubjectModel>(
  'TeacherSubject',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
  }
);

defineTeacher.belongsToMany(defineSubject, { through: 'TeacherSubject' });
defineSubject.belongsToMany(defineTeacher, { through: 'TeacherSubject' });

export default defineTeacherSubject;
