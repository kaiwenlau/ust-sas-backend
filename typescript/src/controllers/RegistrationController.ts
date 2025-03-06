import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import sequelize from '../config/database';
import Logger from '../config/logger';
import defineTeacher from '../model/TeacherModel';
import defineStudent from '../model/StudentModel';
import defineSubject from '../model/SubjectModel';
import defineClass from '../model/ClassModel';
import defineTeacherSubject from '../model/TeacherSubjectModel';
import defineTeacherClass from '../model/TeacherClassModel';
import defineStudentClass from '../model/StudentClassModel';

const RegistrationController = Express.Router();
const LOG = new Logger('RegistrationController.ts');

type ReqTeacher = {
  name: string;
  email: string;
};
type ReqStudents = [
  {
    name: string;
    email: string;
  }
];
type ReqSubject = {
  name: string;
  subjectCode: string;
};
type ReqClass = {
  name: string;
  classCode: string;
};

/**
 * Create or Update
 * @param req
 * @param res
 * @returns
 */
const registrationHandler: RequestHandler = async (req, res) => {
  try {
    if (!('teacher' in req.body)) throw '[400] Teacher is required.';
    if (!('students' in req.body)) throw '[400] Students is required.';
    if (!('subject' in req.body)) throw '[400] Subject is required.';
    if (!('class' in req.body)) throw '[400] Class is required.';

    const result = await sequelize.transaction(async () => {
      const teacherId = await updateTeacher(req.body.teacher);
      const studentIds = await updateStudents(req.body.students);
      const subjectId = await updateSubject(req.body.subject);
      const classId = await updateClass(req.body.class);
      const teacherSubjectId = await updateTeacherSubject(teacherId, subjectId);
      await updateTeacherClass(teacherSubjectId, classId);
      await updateStudentClass(studentIds, classId);
      res.status(StatusCodes.NO_CONTENT).send('Registration success');
    });
  } catch (e) {
    LOG.error(e);
    if (e.includes('400')) res.status(StatusCodes.BAD_REQUEST).send(e);
    else res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
  }
};

const updateTeacher = async (reqTeacher: ReqTeacher) => {
  if (!('name' in reqTeacher)) throw '[400] Teacher name is required.';
  if (!('email' in reqTeacher)) throw '[400] Teacher email is required.';

  const [teacher, created] = await defineTeacher.findOrCreate({
    where: { email: reqTeacher.email },
    defaults: { name: reqTeacher.name },
  });

  if (created) {
    LOG.info('New teacher created.');
  } else {
    await defineTeacher.update(
      {
        name: reqTeacher.name,
      },
      {
        where: {
          email: reqTeacher.email,
        },
      }
    );
    LOG.info('Teacher name updated.');
  }
  return teacher.id;
};

const updateStudents = async (reqStudents: ReqStudents) => {
  const studentIds: number[] = [];
  reqStudents.forEach(async (reqStudent) => {
    if (!('name' in reqStudent)) throw '[400] Student name is required.';
    if (!('email' in reqStudent)) throw '[400] Student email is required.';

    const [student, created] = await defineStudent.findOrCreate({
      where: { email: reqStudent.email },
      defaults: { name: reqStudent.name },
    });
    if (created) {
      LOG.info('New student created.');
    } else {
      await defineStudent.update(
        {
          name: reqStudent.name,
        },
        {
          where: {
            email: reqStudent.email,
          },
        }
      );
      LOG.info('Student name updated.');
    }
    studentIds.push(student.id);
  });
  return studentIds;
};

const updateSubject = async (reqSubject: ReqSubject) => {
  if (!('name' in reqSubject)) throw '[400] Subject name is required.';
  if (!('subjectCode' in reqSubject)) throw '[400] Subject code is required.';

  const [subject, created] = await defineSubject.findOrCreate({
    where: { subjectCode: reqSubject.subjectCode },
    defaults: { name: reqSubject.name },
  });
  if (created) {
    LOG.info('New subject created.');
  } else {
    await defineSubject.update(
      {
        name: reqSubject.name,
      },
      {
        where: {
          subjectCode: reqSubject.subjectCode,
        },
      }
    );
    LOG.info('Subject name updated.');
  }
  return subject.id;
};

const updateClass = async (reqClass: ReqClass) => {
  if (!('name' in reqClass)) throw '[400] Class name is required.';
  if (!('classCode' in reqClass)) throw '[400] Class code is required.';

  const [classes, created] = await defineClass.findOrCreate({
    where: { classCode: reqClass.classCode },
    defaults: { name: reqClass.name },
  });
  if (created) {
    LOG.info('New class created.');
  } else {
    await defineClass.update(
      {
        name: reqClass.name,
      },
      {
        where: {
          classCode: reqClass.classCode,
        },
      }
    );
    LOG.info('Class name updated.');
  }
  return classes.id;
};

const updateTeacherSubject = async (teacherId: number, subjectId: number) => {
  const [teacherSubject, created] = await defineTeacherSubject.findOrCreate({
    where: { teacherId: teacherId, subjectId: subjectId },
  });
  if (created) {
    LOG.info('New teacher subject created.');
  } else {
    LOG.info('Teacher subject link existed.');
  }
  return teacherSubject.id;
};

const updateTeacherClass = async (
  teacherSubjectId: number,
  classId: number
) => {
  const [teacherClass, created] = await defineTeacherClass.findOrCreate({
    where: { teacherSubjectId: teacherSubjectId, classId: classId },
  });
  if (created) {
    LOG.info('New teacher class created.');
  } else {
    LOG.info('Teacher class link existed.');
  }
};

const updateStudentClass = async (studentIds: number[], classId: number) => {
  studentIds.forEach(async (studentId) => {
    const [studentClass, created] = await defineStudentClass.findOrCreate({
      where: { studentId: studentId, classId: classId },
    });
    if (created) {
      LOG.info('New student class created.');
    } else {
      LOG.info('Student class link existed.');
    }
  });
};

RegistrationController.post('/', registrationHandler);

export default RegistrationController;
