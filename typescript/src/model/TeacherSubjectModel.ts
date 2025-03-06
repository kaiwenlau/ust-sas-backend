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
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'teachers',
        key: 'id',
      },
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'subjects',
        key: 'id',
      },
    },
  }
);

defineTeacher.belongsToMany(defineSubject, {
  through: defineTeacherSubject,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});
defineSubject.belongsToMany(defineTeacher, {
  through: defineTeacherSubject,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

export default defineTeacherSubject;
