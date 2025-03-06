import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import Logger from '../config/logger';
import defineTeacher from '../model/TeacherModel';
import defineSubject from '../model/SubjectModel';
import defineTeacherSubject from '../model/TeacherSubjectModel';
import defineTeacherClass from '../model/TeacherClassModel';

const ReportController = Express.Router();
const LOG = new Logger('ReportController.ts');

type SubjectClass = {
  subjectCode: string;
  subjectName: string;
  numberOfClasses: number;
};

type TeacherWorkload = {
  teacherId: number;
  teacherName: string;
  subjectClass: SubjectClass[];
};

const WorkloadReportHandler: RequestHandler = async (req, res) => {
  try {
    const teacherWorkLoadList: TeacherWorkload[] = [];
    const teacherSubjectList = await defineTeacherSubject.findAll({
      attributes: ['id', 'teacherId', 'subjectId'],
    });

    for (const teacherSubject of teacherSubjectList) {
      const teacher = await defineTeacher.findByPk(teacherSubject.teacherId);
      const subject = await defineSubject.findByPk(teacherSubject.subjectId);
      const teacherClassList = await defineTeacherClass.findAll({
        attributes: ['id', 'classId'],
        where: {
          teacherSubjectId: teacherSubject.id,
        },
      });

      const subjectClass: SubjectClass = {
        subjectCode: subject.subjectCode,
        subjectName: subject.name,
        numberOfClasses: teacherClassList.length,
      };

      const index = teacherWorkLoadList.findIndex(
        (teacherWorkLoad) => teacherWorkLoad.teacherId === teacher.id
      );
      if (index < 0) {
        teacherWorkLoadList.push({
          teacherId: teacher.id,
          teacherName: teacher.name,
          subjectClass: [subjectClass],
        });
      } else {
        teacherWorkLoadList[index].subjectClass.push(subjectClass);
      }
    }

    const result = teacherWorkLoadList.map((teacherWorkLoad) => {
      return {
        [teacherWorkLoad.teacherName]: teacherWorkLoad.subjectClass,
      };
    });
    return res.status(StatusCodes.OK).json(result);
  } catch (e) {
    LOG.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

ReportController.post('/workload', WorkloadReportHandler);

export default ReportController;
