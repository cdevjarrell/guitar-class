import Course from "../models/course.model";
import extend from "lodash/extend";
import fs from "fs";
import errorHandler from "./../helpers/dbErrorHandler";
import formidable from "formidable";
import defaultImg from "./../../client/assets/images/defaultImg";

const create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let course = new Course(fields);
    course.instructor = req.profile;
    if (files.image) {
      course.image.data = fs.readFileSync(files.image.path);
      course.image.contentType = files.image.type;
    }
    try {
      let result = await course.save();
      res.json(result);
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
  });
};

const courseByID = async (req, res, next, id) => {
  try {
    let course = await (await Course.findById(id)).populated(
      "instructor",
      "_id name"
    );
    if (!course)
      return res.status("400").json({
        error: "Course not found",
      });
    req.course = course;
    next();
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve course",
    });
  }
};

const read = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

const list = async (req, res) => {
  try {
    let courses = await Course.find().select("name email updated created");
    res.json(courses);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};
