import queueHelper from "../../utils/queueHelper.js";

const checkImportStatus = async (jobId) => {
  try {
    const job = await queueHelper.importQueue.getJob(jobId);
    if (!job) {
      throw new Error(`Job not found for id ${jobId}`);
    }
    const result = {
      status: await job.getState(),
      progress: job.progress,
    };

    return { status: result };
  } catch (err) {
    throw new Error(err.message);
  }
};

export default { checkImportStatus };
