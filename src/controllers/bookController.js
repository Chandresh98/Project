const userModel = require("../models/userModel.js");
const validation = require("../middleware/validation");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel")

//Create books
const createBooks = async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data) == 0) { return res.status(400).send({ status: false, message: "No input provided by user", }); }
    const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data;  // destructuring data
    // checking title is given by user or not if given then its shout check the title should unique at 17-18 line
    
    if (!validation.valid(title)) { return res.status(400).send({ status: false, message: "No title provided by user", }) }
    const existTitle = await bookModel.findOne({ title: title })
   
    if (existTitle) { return res.status(400).send({ status: false, message: " Title already exist", }) }
    // excerpt is provided or not
   
    if (!validation.valid(excerpt)) { return res.status(400).send({ status: false, message: "No excerpt provided by user", }) }
    // user id is provided or not
    
    if (!validation.valid(userId)) { return res.status(400).send({ status: false, message: "No userId provided by user", }) }
    // checking that the userid is provided by user is _id or any rendom number
    
    if (!validation.isValidObjectId(userId)) { return res.status(400).send({ status: false, message: "Not  Valid Object Id", }); }
    // checking the user is present in database or Not
    const user = await userModel.findById(userId)
    if (!user) { return res.status(404).send({ Status: false, message: "User with this id not found" }) }

    if (!validation.valid(ISBN)) { return res.status(400).send({ status: false, message: " No ISBN provided by user", }) }
    // checking isbn not formate that it contain the field that is nessary
    if (!validation.isValidIsbn(ISBN)) {
      return res.status(400).send({ status: false, message: "Enter  valid ISBN number " });
    }
    // checking that validator is unique or not 
    const existISBN = await bookModel.findOne({ ISBN: ISBN })
    if (existISBN) { return res.status(400).send({ status: false, message: " ISBN already exist", }) }

    if (!validation.valid(category)) { return res.status(400).send({ status: false, message: "No category provided by user", }) }
    if (!validation.valid(subcategory)) { return res.status(400).send({ status: false, message: "No subcategory provided by user", }) }

    if (!validation.valid(releasedAt)) { return res.status(400).send({ Status: false, message: "Please provide the realesdAt field and enter a date" }) }
    if (!validation.isValidDateFormat(releasedAt)) { return res.status(400).send({ Status: false, message: "Please enter the date in correct YYYY-MM-DD format" }) }


    if (userId == req.decodedToken.userId) {

      const saveData = await bookModel.create(data)
      return res.status(201).send({ status: true, message: saveData })

    } else { return res.status(403).send({ Status: false, message: "User is not authorized" }) }  // if user is not authorized



  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, message: err.message });
  }
};



// 2. Get Books
const getBooks = async (req, res) => {
  try {
    const data = req.query;
    const filter = { isDeleted: false }
    const { userId, category, subcategory } = data


    if (validation.valid(userId)) {
      if (!validation.isValidObjectId(userId)) { return res.status(400).send({ Status: false, message: "Please enter valid user id" }) }

      filter['userId'] = userId  // assigning userid to filter

    }
    if (validation.valid(category)) {
      filter['category'] = category   // assigning category to filter
    }
    if (validation.valid(subcategory)) {
      filter['subcategory'] = subcategory   // assigning subcategory to filter
    }
    // finding the book with the given entities
    const findData = await bookModel.find(filter).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 })
    if (findData.length == 0) { return res.status(404).send({ Status: false, message: "No books with the respected query were found" }) }

    return res.status(200).send({ Status: true, message: "Book List", Data: findData })

  } catch (err) { console.log(err); return res.status(500).send({ status: false, message: err.message }); }
};



//3. Get Books By Id
const getById = async (req, res) => {
  try {
    const id = req.params.bookId;
    if (!validation.isValidObjectId(id)) { return res.status(400).send({ status: false, message: "Enter valid Book id", }) }

    const findId = await bookModel.findById(id).lean() // lean use to convert in key Value pairs
    if (!findId) { return res.status(404).send({ status: false, message: "No book exist with this Book id" }) }
    if (findId.isDeleted == true) { return res.status(400).send({ status: false, message: "No book present in our database" }) }

    let reviews = await reviewModel.find({ bookId: id, isDeleted: false })
    findId['reviewsData'] = reviews // we assigning review data to book data
    return res.status(200).send({ status: true, message: "Data list", Data: findId })
  } catch (err) { console.log(err); return res.status(500).send({ status: false, message: err.message, }); }
};


//Update Books
const updateBooks = async (req, res) => {
  try {
    const id = req.params.bookId;
    if (!validation.isValidObjectId(id)) { return res.status(400).send({ Status: false, message: "Please enter valid id" }) }
    if (Object.keys(req.body).length == 0 || req.body == null) { return res.status(400).send({ Status: false, message: "Please provide input" }) }

    const findId = await bookModel.findById(id)
    if (!findId) { return res.status(404).send({ status: false, message: "No book with the given id exists", }) }
    if (findId.isDeleted == true) { return res.status(400).send({ Status: false, message: "The requested book is not found" }) }

    if (findId.userId == req.decodedToken.userId) {     // checking authentication

      const { title, excerpt, ISBN, releasedAt } = req.body

      const filter = {}
      if (validation.valid(title)) {
        let duplliTitle = await bookModel.findOne({ title: title })
        if (duplliTitle) { return res.status(400).send({ Status: false, message: "This title already exists. Please enter a different title" }) }
        filter["title"] = title
      }

      if (validation.valid(ISBN)) {
        if (!validation.isValidIsbn(ISBN)) { return res.status(400).send({ Status: false, message: "Please entr a valid ISBN" }) }
        let dupliIsbn = await bookModel.findOne({ ISBN: ISBN })
        if (dupliIsbn) { return res.status(400).send({ Status: false, message: "This ISBN already exists. Please enter a different ISBN" }) }
        filter["ISBN"] = ISBN
      }

      if (validation.valid(excerpt)) {
        filter["excerpt"] = excerpt
      }

      if (validation.valid(releasedAt)) {
        if (!validation.isValidDateFormat(releasedAt)) { return res.status(400).send({ Status: false, message: "Please enter the date in correct YYYY-MM-DD format" }) }

        filter["releasedAt"] = releasedAt
      }
     
      const updateData = await bookModel.findOneAndUpdate({ _id: id }, {
        $set: filter
      }, { new: true })

      return res.status(200).send({ status: true, message: updateData })

    } else { return res.status(403).send({ Status: false, message: "The user is not authorized to update the requested book" }) }

  } catch (err) { console.log(err); return res.status(500).send({ status: false, message: err.message }); }
};



//delet by id
const deleteBooks = async (req, res) => {

  try {
    let id = req.params.bookId
    let book = await bookModel.findById(id)
    if (!book) { return res.status(404).send({ Status: false, message: "No book found" }) }
    if (book.isDeleted === true) { return res.status(400).send({ Status: false, message: "The requested book is not found" }) }
    if (book.userId == req.decodedToken.userId) {  // authotication checking

      await bookModel.findOneAndUpdate({ _id: id }, { isDeleted: true, deletedAt: Date.now() }, { new: true })
      return res.status(200).send({ Staus: true, message: "Deleted" })

    } else { return res.status(403).send({ Status: false, message: "Not Authorized" }) }


  } catch (err) { return res.status(500).send({ Status: false, message: err.message }) }




}


module.exports = {
  createBooks,
  getBooks,
  getById,
  updateBooks,
  deleteBooks,
};

//module.exports.createBooks = createBooks
