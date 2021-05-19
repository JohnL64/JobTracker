const db = require('../models/query');

const jobsController = {};

// GET jobs from jobs table
jobsController.getJobs = (req, res, next) => {
	const user_id = parseInt(req.params.user_id);
	const queryString = `SELECT * FROM jobs WHERE user_id=${user_id}`;
	db.query(queryString)
		.then((jobs) => {
			res.locals.allJobs = jobs.rows;
			return next();
		})
		.catch((err) => next(err));
};

// POST job to jobs table
jobsController.addJob = (req, res, next) => {
	const { user_id, company_name, job_title, job_description_link, progression, next_appointment, contact, entry_point, offer } = req.body
	const addJobQuery = `
	INSERT INTO jobs (user_id, company_name, job_title, job_description_link, progression, next_appointment, contact, entry_point, offer)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;

	const values = [user_id, company_name, job_title, job_description_link, progression, next_appointment, contact, entry_point, offer]

	db.query(addJobQuery, values)
		.then((addedJob) => {
			res.locals.message = 'Job has been successfully added';
			return next();
		})
		.catch((err) => next({message: 'Error has occured at jobsController.addJob'}));
}

// DELETE job from jobs table
jobsController.deleteJob = (req, res, next) => {
	const { id } = req.body
	const deleteJobQuery = `DELETE FROM jobs WHERE _id=${id}`;

	db.query(deleteJobQuery)
		.then((deletedJob) => {
			res.locals.message = 'Job has been successfully removed';
			return next();
		})
		.catch((err) => next({message: 'Error has occured at jobsController.deleteJob'}));
}

// PATCH (edit) specified job from jobs table
jobsController.editJob = (req, res, next) => {
	const { jobId, next_appointment, progression, job_description_link} = req.body;

	const editJobQuery = `UPDATE users 
	SET job_description_link = $1, progression = $2, next_appointment = $3
	WHERE _id=${jobId}`;;
	// if ()
	// `UPDATE users 
	// SET job_description_link = $1, progression = $2, next_appointment = $3
	// WHERE _id=${jobId}`;

	const values = [job_description_link, progression, next_appointment];

	db.query(editJobQuery, values)
		.then((editedJob) => {
			res.locals.message = 'Job has been successfully edited';
			return next();
		})
		.catch((err) => {
			console.log(err);
			return next({message: 'Error has occured at jobsController.deleteJob'})
		});
}

module.exports = jobsController;
