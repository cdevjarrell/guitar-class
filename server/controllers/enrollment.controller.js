import Enrollment from "../models/enrollment.model";
import errorHandler from "./../helper/dbErrorHandler";

const create = async (req, res) => {
  let newErollment = {
    course: req.course,
    studnet: req.auth,
  };
  newEnrollment.lessonStatus = req.course.lessons.mpa((lesson) => {
    return { lesson: lesson, complete: false };
  });
  const enrollment = new Enrollment(newEnrollment);
  try {
    let result = await enrollment.save();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//Load the enrollment and append to req

const enrollmentByID = async (req, res, next, id) => {
  try {
    let enrollment = await Enrollment.findById(id)
      .populate({ path: "course", populate: { path: "instructor" } })
      .populate("student", "_id name");
    if (!enrollment)
      return res.status("400").json({
        error: "Enrollment not found",
      });
    req.enrollment = enrollment;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve enrollment",
    });
  }
};

const read = (req, res) => {
  return res.json(req.enrollment);
};
