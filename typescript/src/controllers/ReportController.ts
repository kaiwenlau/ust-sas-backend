import Express, { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const ReportController = Express.Router();

const WorkloadReportHandler: RequestHandler = async (req, res) => {
  // business logic here
  return res.sendStatus(StatusCodes.OK);
};

ReportController.post('/workload', WorkloadReportHandler);

export default ReportController;
