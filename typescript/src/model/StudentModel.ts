import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';

const LOG = new Logger('StudentModel.ts');

interface StudentModel extends Model {
  id: number;
  name: string;
  email: string;
}

const defineStudent = sequelize.define<StudentModel>('students', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default defineStudent;
