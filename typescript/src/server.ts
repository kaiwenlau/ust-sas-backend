import 'dotenv/config';
import sequelize from './config/database';
import Logger from './config/logger';
import defineTeacher from './model/TeacherModel';
import defineStudent from './model/StudentModel';
import defineSubject from './model/SubjectModel';
import defineClass from './model/ClassModel';
import defineTeacherSubject from './model/TeacherSubjectModel';
import defineTeacherClass from './model/TeacherClassModel';
import defineStudentClass from './model/StudentClassModel';

import App from './app';

const MAX_RETRY = 20;
const LOG = new Logger('server.ts');
const { PORT = 3000 } = process.env;

const startApplication = async (retryCount: number) => {
  try {
    await sequelize.authenticate();
    App.listen(PORT, () => {
      LOG.info(`Application started at http://localhost:${PORT}`);
    });
    await modelSync();
  } catch (e) {
    LOG.error(e);

    const nextRetryCount = retryCount - 1;
    if (nextRetryCount > 0) {
      setTimeout(async () => await startApplication(nextRetryCount), 3000);
      return;
    }

    LOG.error('Unable to start application');
  }
};

const modelSync = async () => {
  return Promise.all([
    defineTeacher,
    defineStudent,
    defineSubject,
    defineClass,
    defineTeacherSubject,
    defineTeacherClass,
    defineStudentClass,
  ]).then(() =>
    sequelize
      .sync()
      .then(() => {
        LOG.info('All tables created successfully!');
      })
      .catch((error) => {
        LOG.error(`Error in creating table: ${error}`);
      })
  );
};

startApplication(MAX_RETRY);
