import queueService from "./queue.service.js";

const checkImportStatus = async (req, res, next) => {
  try {
    const result = await queueService.checkImportStatus(req.params.jobId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
const checkExportStatus = async (req, res, next) => {
  try {
    const result = await queueService.checkExportStatus(req.params.jobId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
const downloadExportFile = async (req, res, next) => {
  try {
    const result = await queueService.downloadExportFile(req.params.jobId);
    res.download(result.link);
  } catch (err) {
    next(err);
  }
};

export default { checkImportStatus, checkExportStatus, downloadExportFile };
