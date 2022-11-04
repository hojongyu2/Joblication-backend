const express = require("express");
const axios = require("axios");

const searchRouter = express.Router();

searchRouter.post("/job-search", async (req, res, next) => {
  const { jobTitle, location } = req.body;
  try {
    if (jobTitle) {
      const pageNumber = 1;
      const pagenatedData = [];
      const jobResponse = await axios.get(
        `https://api.whatjobs.com/api/v1/jobs.json?publisher=3785&user_ip=100.8.240.174&keyword=${jobTitle}&location=${location}&radius=100&limit=50&page=${pageNumber}`
      );
      const total = jobResponse.data.total;
      // using for loop to get all page nated data and stored in an empty array
      const currentPage = Number(jobResponse.data.current_page);
      const lastPage = jobResponse.data.last_page;
      for (let i = currentPage; i <= lastPage; i++) {
        if (currentPage <= lastPage) {
          let fetch = await axios.get(
            `https://api.whatjobs.com/api/v1/jobs.json?publisher=3785&user_ip=100.8.240.174&keyword=${jobTitle}&location=${location}&radius=100&limit=50&page=${i}`
          );
            pagenatedData.push(fetch.data.data)
        }
      }
      res.json({searchResult:pagenatedData, total});
    }
  } catch (error) {
    next(error)
  }
});

module.exports = searchRouter;
