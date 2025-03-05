import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';

const LOG = new Logger('SubjectModel.ts');

interface SubjectModel extends Model {
  id: number;
  name: string;
  subjectCode: string;
}

const defineSubject = sequelize.define<SubjectModel>('subjects', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subjectCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default defineSubject;
