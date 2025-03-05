import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import Logger from '../config/logger';

const LOG = new Logger('ClassModel.ts');

interface ClassModel extends Model {
  id: number;
  name: string;
  classCode: string;
}

const defineClass = sequelize.define<ClassModel>('classes', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  classCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default defineClass;
