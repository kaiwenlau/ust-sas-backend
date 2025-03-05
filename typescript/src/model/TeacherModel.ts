import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';

const LOG = new Logger('TeacherModel.ts');

interface TeacherModel extends Model {
  id: number;
  name: string;
  email: string;
}

const defineTeacher = sequelize.define<TeacherModel>('teachers', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default defineTeacher;
